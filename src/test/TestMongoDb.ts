import { Logger } from '@nodescript/logger';
import { config } from 'mesh-config';
import { dep } from 'mesh-ioc';
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
    }

    async stop() {
        await this.client.close();
    }

}
