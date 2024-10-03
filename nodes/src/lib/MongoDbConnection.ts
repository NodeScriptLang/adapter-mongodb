import { MongoProtocol, mongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { InvalidTypeError } from '@nodescript/core/util';
import { createHttpClient } from '@nodescript/protocomm';

const SYM_MONGODB_CONNECTION = Symbol.for('ns:MongoDbConnection');

export function requireConnection(value: unknown): MongoDbConnection {
    if ((value as any)[SYM_MONGODB_CONNECTION]) {
        return value as MongoDbConnection;
    }
    throw new InvalidTypeError('MongoDB Connection required. Use the output of MongoDB Connect node.');
}

export class MongoDbConnection {

    rpc!: MongoProtocol;

    constructor(readonly databaseUrl: string, readonly adapterUrl: string) {
        const parsedUrl = new URL(adapterUrl);
        const secret = parsedUrl.username;
        parsedUrl.username = '';
        parsedUrl.password = '';
        const rpc = createHttpClient(mongoProtocol, {
            baseUrl: parsedUrl.href,
            headers: secret ? {
                authorization: `Bearer ${secret}`,
            } : undefined,
        });
        Object.defineProperties(this, {
            databaseUrl: {
                enumerable: false,
                value: databaseUrl,
            },
            adapterUrl: {
                enumerable: false,
                value: adapterUrl,
            },
            rpc: {
                enumerable: false,
                value: rpc,
            },
        });
    }

    get Mongo() {
        return this.rpc.Mongo;
    }

    get [SYM_MONGODB_CONNECTION]() {
        return true;
    }

}
