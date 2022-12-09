import { config } from '@nodescript/config';
import { Logger } from '@nodescript/logger';
import { dep } from '@nodescript/mesh';
import { Db, MongoClient } from 'mongodb';

export class TestMongoDb {

    @config() MONGO_URL!: string;

    @dep() logger!: Logger;

    client: MongoClient;

    constructor() {
        this.client = new MongoClient(this.MONGO_URL);
    }

    get db(): Db {
        return this.client.db();
    }

    async start() {
        await this.client.connect();
        this.logger.info('Connected to MongoDB');
    }

    async stop() {
        await this.client.close();
        this.logger.info('MongoDB connection closed');
    }
}
