import { MongoFilter, MongoUpdate } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

type P = {
    connection: unknown;
    collection: string;
    filter: MongoFilter;
    update: MongoUpdate;
    upsert: boolean;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.1',
    moduleName: 'Mongo DB / Update One',
    description: 'Updates a single document matching criteria in specified MongoDB collection.',
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
        upsert: {
            schema: { type: 'boolean' },
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
    const upsert = params.upsert;
    return await connection.Mongo.updateOne({
        databaseUrl: connection.databaseUrl,
        collection,
        filter,
        update,
        upsert,
    });
};
