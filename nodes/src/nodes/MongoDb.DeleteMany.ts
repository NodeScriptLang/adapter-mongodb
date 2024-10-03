import { MongoFilter } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

type P = {
    connection: unknown;
    collection: string;
    filter: MongoFilter;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.1',
    moduleName: 'Mongo DB / Delete Many',
    description: 'Deletes multiple documents matching criteria in specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'delete'],
    params: {
        connection: {
            schema: { type: 'any' },
            hideValue: true,
        },
        collection: {
            schema: { type: 'string' },
        },
        filter: {
            schema: {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'any' },
            },
        },
    },
    result: {
        async: true,
        schema: { type: 'any' },
    },
    evalMode: 'manual',
    cacheMode: 'always',
};

export const compute: ModuleCompute<P, R> = async params => {
    const connection = requireConnection(params.connection);
    const collection = params.collection;
    const filter = params.filter;
    return await connection.Mongo.deleteMany({
        databaseUrl: connection.databaseUrl,
        collection,
        filter,
    });
};
