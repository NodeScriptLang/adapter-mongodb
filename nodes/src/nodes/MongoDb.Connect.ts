import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { MongoDbConnection } from '../lib/MongoDbConnection.js';

type P = {
    url: string;
    adapterUrl: string;
};
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.5',
    moduleName: 'Mongo DB / Connect',
    description: 'Returns the connection required by other nodes.',
    keywords: ['mongodb', 'database', 'storage', 'connect'],
    params: {
        adapterUrl: {
            schema: {
                type: 'string',
                default: ''
            },
        },
        url: {
            schema: { type: 'string' },
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
    const adapterUrl = params.adapterUrl;
    const databaseUrl = params.url;
    const connection = new MongoDbConnection(databaseUrl, adapterUrl);
    return connection;
};
