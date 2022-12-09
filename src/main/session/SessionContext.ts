import { ClientError } from '@nodescript/errors';
import { MongoClient } from 'mongodb';

export class SessionContext {

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
        const parsedUrl = new URL(url);
        const effectiveUrl = new URL(`mongodb://${parsedUrl.host}${parsedUrl.pathname}`);
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
        return client;
    }

    requireConnection() {
        if (this.connection) {
            return this.connection;
        }
        throw new ClientError('Not connected to MongoDb');
    }

}
