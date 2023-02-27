import { ClientError } from '@nodescript/errors';
import { dep } from 'mesh-ioc';

import { ConnectionManager } from '../ConnectionManager.js';
import { MongoConnection } from '../util/MongoConnection.js';

export class SessionContext {

    @dep() private connectionManager!: ConnectionManager;

    connection: MongoConnection | null = null;

    async connect(url: string) {
        if (this.connection) {
            throw new ClientError('Already connected to MongoDb');
        }
        this.connection = await this.connectionManager.getConnection(url);
        this.connection.touch();
        this.connection.sessionsCount += 1;
    }

    async destroy() {
        if (this.connection) {
            this.connection.sessionsCount -= 1;
        }
    }

    requireConnection() {
        if (this.connection) {
            return this.connection;
        }
        throw new ClientError('Not connected to MongoDb');
    }

}
