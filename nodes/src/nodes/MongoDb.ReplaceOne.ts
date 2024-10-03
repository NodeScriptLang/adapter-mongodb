import { MongoDocument, MongoFilter } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

type P = {
    connection: unknown;
    collection: string;
    filter: MongoFilter;
    replacement: MongoDocument;
    upsert: boolean;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.1',
    moduleName: 'Mongo DB / Replace One',
    description: 'Replaces a single document matching criteria in specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'replace', 'save'],
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
        replacement: {
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
    const replacement = params.replacement;
    const upsert = params.upsert;
    return await connection.Mongo.replaceOne({
        databaseUrl: connection.databaseUrl,
        collection,
        filter,
        replacement,
        upsert,
    });
};
