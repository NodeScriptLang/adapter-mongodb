import { DomainDef } from '@nodescript/protocomm';

import { MongoAggregate, MongoAggregateSchema } from '../schema/MongoAggregate.js';
import { MongoDocument, MongoDocumentSchema } from '../schema/MongoDocument.js';
import { MongoFilter, MongoFilterSchema } from '../schema/MongoFilter.js';
import { MongoProjection, MongoProjectionSchema } from '../schema/MongoProjection.js';
import { MongoReadPreference, MongoReadPreferenceSchema } from '../schema/MongoReadPreference.js';
import { MongoSort, MongoSortSchema } from '../schema/MongoSort.js';
import { MongoUpdate, MongoUpdateSchema } from '../schema/MongoUpdate.js';

export interface MongoDomain {

    connect(req: {
        databaseUrl: string;
    }): Promise<{}>;

    findOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        readPreference?: MongoReadPreference;
    }): Promise<{
        document: MongoDocument | null;
    }>;

    findMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        sort?: MongoSort;
        limit?: number;
        skip?: number;
        readPreference?: MongoReadPreference;
    }): Promise<{
        documents: MongoDocument[];
    }>;

    insertOne(req: {
        databaseUrl: string;
        collection: string;
        document: MongoDocument;
    }): Promise<{
        insertedId: string;
    }>;

    insertMany(req: {
        databaseUrl: string;
        collection: string;
        documents: MongoDocument[];
    }): Promise<{
        insertedIds: string[];
    }>;

    updateOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }>;

    updateMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
    }>;

    replaceOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        replacement: MongoDocument;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }>;

    deleteOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
    }): Promise<{
        deletedCount: number;
    }>;

    deleteMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
    }): Promise<{
        deletedCount: number;
    }>;

    aggregate(req: {
        databaseUrl: string;
        collection: string;
        pipeline: MongoAggregate[];
        readPreference?: MongoReadPreference;
    }): Promise<{
        documents: MongoDocument[];
    }>;

}

export const MongoDomain: DomainDef<MongoDomain> = {
    name: 'Mongo',
    methods: {
        connect: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
            },
            returns: {},
        },
        findOne: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
                projection: {
                    ...MongoProjectionSchema.schema,
                    optional: true,
                },
                readPreference: {
                    ...MongoReadPreferenceSchema.schema,
                    optional: true,
                },
            },
            returns: {
                document: {
                    ...MongoDocumentSchema.schema,
                    nullable: true,
                }
            }
        },
        findMany: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
                projection: {
                    ...MongoProjectionSchema.schema,
                    optional: true,
                },
                sort: {
                    ...MongoSortSchema.schema,
                    optional: true,
                },
                limit: {
                    type: 'number',
                    optional: true,
                },
                skip: {
                    type: 'number',
                    optional: true,
                },
                readPreference: {
                    ...MongoReadPreferenceSchema.schema,
                    optional: true,
                },
            },
            returns: {
                documents: {
                    type: 'array',
                    items: MongoDocumentSchema.schema,
                }
            }
        },
        insertOne: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                document: MongoDocumentSchema.schema,
            },
            returns: {
                insertedId: { type: 'string' },
            }
        },
        insertMany: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                documents: {
                    type: 'array',
                    items: MongoDocumentSchema.schema
                },
            },
            returns: {
                insertedIds: {
                    type: 'array',
                    items: { type: 'string' },
                },
            }
        },
        updateOne: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
                update: MongoUpdateSchema.schema,
                upsert: { type: 'boolean' },
            },
            returns: {
                matchedCount: { type: 'number' },
                modifiedCount: { type: 'number' },
                upsertedId: {
                    type: 'string',
                    optional: true,
                },
            }
        },
        updateMany: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
                update: MongoUpdateSchema.schema,
            },
            returns: {
                matchedCount: { type: 'number' },
                modifiedCount: { type: 'number' },
            }
        },
        replaceOne: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
                replacement: MongoDocumentSchema.schema,
                upsert: { type: 'boolean' },
            },
            returns: {
                matchedCount: { type: 'number' },
                modifiedCount: { type: 'number' },
                upsertedId: {
                    type: 'string',
                    optional: true,
                },
            }
        },
        deleteOne: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
            },
            returns: {
                deletedCount: { type: 'number' },
            }
        },
        deleteMany: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                filter: MongoFilterSchema.schema,
            },
            returns: {
                deletedCount: { type: 'number' },
            }
        },
        aggregate: {
            type: 'command',
            params: {
                databaseUrl: { type: 'string' },
                collection: { type: 'string' },
                pipeline: {
                    type: 'array',
                    items: MongoAggregateSchema.schema,
                },
                readPreference: {
                    ...MongoReadPreferenceSchema.schema,
                    optional: true,
                },
            },
            returns: {
                documents: {
                    type: 'array',
                    items: MongoDocumentSchema.schema,
                }
            },
        },
    },
    events: {},
};
