import { MongoReadPreference, MongoReadPreferenceSchema } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

type P = {
    connection: unknown;
    collection: string;
    pipeline: any[];
    readPreference: MongoReadPreference;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.3',
    moduleName: 'Mongo DB / Aggregate',
    description: 'Runs an aggregation pipeline in specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'aggregate'],
    params: {
        connection: {
            schema: { type: 'any' },
            hideValue: true,
        },
        collection: {
            schema: { type: 'string' },
        },
        pipeline: {
            schema: {
                type: 'array',
                items: { type: 'any' },
            },
            hideValue: true,
        },
        readPreference: {
            schema: MongoReadPreferenceSchema.schema,
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
    const collection = params.collection;
    const pipeline = params.pipeline;
    const { documents } = await connection.Mongo.aggregate({
        databaseUrl: connection.databaseUrl,
        collection,
        pipeline,
        readPreference: params.readPreference ?? 'primary',
    });
    return documents;
};
