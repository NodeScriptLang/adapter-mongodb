import { MongoDocument } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

interface P {
    connection: unknown;
    collection: string;
    documents: MongoDocument[];
    ordered?: boolean;
}
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.4',
    moduleName: 'Mongo DB / Insert Many',
    description: 'Inserts multiple documents into specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'insert'],
    params: {
        connection: {
            schema: { type: 'any' },
            hideValue: true,
        },
        collection: {
            schema: { type: 'string' },
        },
        documents: {
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {},
                    additionalProperties: { type: 'any' },
                },
            },
        },
        ordered: {
            schema: { type: 'boolean', optional: true },
            advanced: true,
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
    const { collection, documents, ordered } = params;
    const res = await connection.Mongo.insertMany({
        databaseUrl: connection.databaseUrl,
        collection,
        documents,
        ordered,
    });
    return res;
};
