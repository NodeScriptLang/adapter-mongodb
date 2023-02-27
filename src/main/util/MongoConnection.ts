import { MongoClient } from 'mongodb';

/**
 * Encapsulates Mongo connection with the counter of sessions it's used in
 * and last use stats to facilitate cleanups.
 */
export class MongoConnection {

    sessionsCount = 0;
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
