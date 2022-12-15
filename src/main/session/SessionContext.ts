import { ClientError } from '@nodescript/errors';
import { Logger } from '@nodescript/logger';
import { dep } from 'mesh-ioc';
import { MongoClient } from 'mongodb';

import { Metrics } from '../Metrics.js';

export class SessionContext {

    @dep() private logger!: Logger;
    @dep() private metrics!: Metrics;

    connection: MongoClient | null = null;

    async connect(url: string) {
        if (this.connection) {
            throw new ClientError('Already connected to MongoDb');
        }
        this.connection = await this.createConnection(url);
    }

    async destroy() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }

    protected async createConnection(url: string) {
        try {
            const parsedUrl = new URL(url);
            const effectiveUrl = new URL(`${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`);
            this.logger.info(`Connecting to ${parsedUrl.host}`);
            if (parsedUrl.username) {
                effectiveUrl.username = parsedUrl.username;
            }
            if (parsedUrl.password) {
                effectiveUrl.password = parsedUrl.password;
            }
            const client = new MongoClient(effectiveUrl.toString(), {
                minPoolSize: 1,
                maxPoolSize: 1,
                ignoreUndefined: true,
                writeConcern: {
                    w: 'majority',
                }
            });
            await client.connect();
            this.metrics.connectionStats.incr(1, { type: 'connect' });
            client.once('close', () => {
                this.metrics.connectionStats.incr(1, { type: 'close' });
            });
            return client;
        } catch (error) {
            this.logger.error('Mongo connection failed', { error });
            this.metrics.connectionStats.incr(1, { type: 'fail' });
            throw error;
        }
    }

    requireConnection() {
        if (this.connection) {
            return this.connection;
        }
        throw new ClientError('Not connected to MongoDb');
    }

}
