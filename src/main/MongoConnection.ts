import { Logger } from '@nodescript/logger';
import { dep } from 'mesh-ioc';
import { MongoClient } from 'mongodb';
import { Event } from 'nanoevent';

import { Metrics } from './Metrics.js';

/**
 * Encapsulates Mongo Client to facilitate connection pool usage and cleanups.
 */
export class MongoConnection {

    @dep() private logger!: Logger;
    @dep() private metrics!: Metrics;

    becameIdle = new Event<void>();

    private createdAt = Date.now();
    private usedConnections = 0;
    private connectPromise: Promise<void> | null = null;

    constructor(
        readonly connectionKey: string,
        protected client: MongoClient,
    ) {
        client.on('connectionCreated', ev => {
            // This happens when pool establishes a new connection
            this.logger.info('Connection created', { connectionKey, connectionId: ev.connectionId });
            this.metrics.connectionStats.incr(1, {
                type: 'connectionCreated'
            });
        });
        client.on('connectionClosed', ev => {
            // This happens when pool closes a connection
            this.logger.info('Connection closed', {
                connectionKey,
                connectionId: ev.connectionId,
                reason: ev.reason,
            });
            this.metrics.connectionStats.incr(1, {
                type: 'connectionClosed',
            });
        });
        client.on('connectionCheckedOut', () => {
            // This happens when connection is taken from pool to run a bunch of operations
            this.usedConnections += 1;
        });
        client.on('connectionCheckedIn', () => {
            // This happens when connection is returned back to pool after
            // all its operations are complete
            this.usedConnections -= 1;
            if (this.usedConnections === 0) {
                this.becameIdle.emit();
            }
        });
    }

    async connect() {
        if (!this.connectPromise) {
            this.connectPromise = (async () => {
                await this.client.connect();
                this.metrics.connectionStats.incr(1, { type: 'connect' });
                this.logger.info(`MongoDB client connected`, { connectionKey: this.connectionKey });
            })();
        }
        await this.connectPromise;
    }

    async closeNow() {
        try {
            await this.client.close();
            this.metrics.connectionStats.incr(1, { type: 'close' });
            this.logger.info('MongoDB client closed', { connectionKey: this.connectionKey });
        } catch (error) {
            this.logger.error('MongoDB client close failed', {
                error,
                connectionKey: this.connectionKey,
            });
        }
    }

    async closeGracefully(timeout = 10000) {
        await Promise.race([
            await this.waitIdle(),
            new Promise<void>(resolve => setTimeout(() => resolve(), timeout).unref()),
        ]);
        await this.closeNow();
    }

    get age() {
        return Date.now() - this.createdAt;
    }

    db(dbName?: string) {
        return this.client.db(dbName);
    }

    private async waitIdle() {
        return new Promise<void>(resolve => {
            if (this.usedConnections === 0) {
                return resolve();
            }
            this.becameIdle.once(resolve);
        });
    }

}
