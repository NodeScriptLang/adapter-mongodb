import { MongoClient } from 'mongodb';

/**
 * Encapsulates Mongo Client with last use stats to facilitate cleanups.
 */
export class MongoConnection {

    lastActiveAt = Date.now();

    constructor(
        readonly connectionKey: string,
        readonly client: MongoClient,
    ) {}

    touch() {
        this.lastActiveAt = Date.now();
    }

    db(dbName?: string) {
        this.touch();
        return this.client.db(dbName);
    }

}
