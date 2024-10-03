import { MongoFilter, MongoUpdate } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

type P = {
    connection: unknown;
    collection: string;
    filter: MongoFilter;
    update: MongoUpdate;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.1',
    moduleName: 'Mongo DB / Update Many',
    description: 'Updates documents matching criteria in specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'update'],
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
        update: {
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
    const update = params.update;
    return await connection.Mongo.updateMany({
        databaseUrl: connection.databaseUrl,
        collection,
        filter,
        update,
    });
};
