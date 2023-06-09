import { Logger } from '@nodescript/logger';
import { config } from 'mesh-config';
import { dep } from 'mesh-ioc';
import { MongoClient } from 'mongodb';

import { Metrics } from './Metrics.js';
import { MongoConnection } from './util/MongoConnection.js';

export class ConnectionManager {

    @config({ default: 5 })
    POOL_SIZE!: number;

    @config({ default: 10_000 })
    SWEEP_INTERVAL_MS!: number;

    @config({ default: 120_000 })
    SWEEP_INACTIVE_TIMEOUT_MS!: number;

    @config({ default: 60_000 })
    MAX_IDLE_TIME_MS!: number;

    @config({ default: 5_000 })
    CONNECT_TIMEOUT_MS!: number;

    @dep() private logger!: Logger;
    @dep() private metrics!: Metrics;

    private connectionMap = new Map<string, MongoConnection>();
    private running = false;
    private sweepPromise: Promise<void> = Promise.resolve();

    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.sweepPromise = this.sweepLoop();
    }

    async stop() {
        this.running = false;
        await this.sweepPromise;
        this.closeAllConnections();
    }

    async getConnection(url: string): Promise<MongoConnection> {
        try {
            const parsedUrl = new URL(url);
            parsedUrl.searchParams.delete('connectTimeoutMS');
            parsedUrl.searchParams.delete('heartbeatFrequencyMS');
            parsedUrl.searchParams.delete('ignoreUndefined');
            parsedUrl.searchParams.delete('maxIdleTimeMS');
            parsedUrl.searchParams.delete('maxPoolSize');
            parsedUrl.searchParams.delete('minPoolSize');
            parsedUrl.searchParams.delete('socketTimeoutMS');
            parsedUrl.searchParams.delete('w');
            parsedUrl.searchParams.delete('waitQueueTimeoutMS');
            parsedUrl.searchParams.delete('writeConcern');
            const connectionKey = parsedUrl.href;
            const existing = this.connectionMap.get(connectionKey);
            if (existing) {
                return existing;
            }
            const client = new MongoClient(parsedUrl.toString(), {
                minPoolSize: 0,
                maxPoolSize: this.POOL_SIZE,
                waitQueueTimeoutMS: 0,
                ignoreUndefined: true,
                heartbeatFrequencyMS: 30_000,
                connectTimeoutMS: this.CONNECT_TIMEOUT_MS,
                maxIdleTimeMS: this.MAX_IDLE_TIME_MS,
                writeConcern: {
                    w: 'majority',
                },
            });
            await client.connect();
            client.on('connectionCreated', () => {
                this.metrics.connectionStats.incr(1, { type: 'connectionCreated' });
            });
            client.on('connectionClosed', () => {
                this.metrics.connectionStats.incr(1, { type: 'connectionClosed' });
            });
            const connection = new MongoConnection(connectionKey, client);
            this.connectionMap.set(connectionKey, connection);
            this.metrics.connectionStats.incr(1, { type: 'connect' });
            this.logger.info(`Mongo connection created`, { connectionKey });
            return connection;
        } catch (error) {
            this.logger.error('Mongo connection failed', { error });
            this.metrics.connectionStats.incr(1, { type: 'fail' });
            throw error;
        }
    }

    private closeAllConnections() {
        for (const connection of this.connectionMap.values()) {
            this.closeConnection(connection);
        }
    }

    private closeIdleConnections() {
        for (const connection of this.connectionMap.values()) {
            const idle = Date.now() > connection.lastActiveAt + this.SWEEP_INACTIVE_TIMEOUT_MS;
            if (idle) {
                this.closeConnection(connection);
            }
        }
    }

    private async sweepLoop() {
        if (!this.SWEEP_INTERVAL_MS) {
            return;
        }
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, this.SWEEP_INTERVAL_MS).unref());
            this.logger.info('Sweep: closing idle connections');
            this.closeIdleConnections();
        }
    }

    private closeConnection(connection: MongoConnection) {
        const { connectionKey } = connection;
        this.connectionMap.delete(connectionKey);
        connection.client.close(true)
            .catch(error => {
                this.logger.error('Mongo connection close failed', { error, connectionKey });
            });
        this.metrics.connectionStats.incr(1, { type: 'close' });
        this.logger.info('Mongo connection closed', { connectionKey });
    }

}
