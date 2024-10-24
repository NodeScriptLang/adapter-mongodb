import { Logger } from '@nodescript/logger';
import { config } from 'mesh-config';
import { dep, Mesh } from 'mesh-ioc';
import { MongoClient } from 'mongodb';

import { MongoConnection } from '../MongoConnection.js';

export class ConnectionManager {

    @config({ default: 10 })
    POOL_SIZE!: number;

    @config({ default: 60_000 })
    POOL_TTL_MS!: number;

    @config({ default: 30_000 })
    SWEEP_INTERVAL_MS!: number;

    @config({ default: 10_000 })
    CONNECT_TIMEOUT_MS!: number;

    @dep() private mesh!: Mesh;
    @dep() private logger!: Logger;

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
        await this.closeAllConnections();
    }

    getConnection(url: string): MongoConnection {
        const { connectionUrl, connectionKey } = this.prepareConnectionDetails(url);
        const existing = this.connectionMap.get(connectionKey);
        if (existing) {
            return existing;
        }
        const client = new MongoClient(connectionUrl, {
            minPoolSize: 0,
            maxPoolSize: this.POOL_SIZE,
            waitQueueTimeoutMS: 0,
            ignoreUndefined: true,
            heartbeatFrequencyMS: 60_000,
            connectTimeoutMS: this.CONNECT_TIMEOUT_MS,
            retryWrites: true,
            writeConcern: {
                w: 'majority',
            },
        });
        const connection = new MongoConnection(connectionKey, client);
        this.connectionMap.set(connectionKey, connection);
        this.mesh.connect(connection);
        return connection;
    }

    private async closeAllConnections() {
        const conns = [...this.connectionMap.values()];
        this.connectionMap.clear();
        await Promise.all(conns.map(_ => _.closeGracefully()));
    }

    private async closeExpired() {
        const expiredConnections = [...this.connectionMap.values()].filter(_ => _.age > this.POOL_TTL_MS);
        this.logger.info(`Sweep: closing ${expiredConnections.length} expired connections`);
        for (const conn of expiredConnections) {
            this.connectionMap.delete(conn.connectionKey);
            await conn.closeGracefully();
        }
    }

    private async sweepLoop() {
        if (!this.SWEEP_INTERVAL_MS) {
            return;
        }
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, this.SWEEP_INTERVAL_MS).unref());
            this.closeExpired();
        }
    }

    private prepareConnectionDetails(url: string) {
        const parsedUrl = new URL(url);
        parsedUrl.search = '';
        const connectionUrl = parsedUrl.href;
        parsedUrl.password = '';
        const connectionKey = parsedUrl.href;
        return { connectionUrl, connectionKey };
    }

}
