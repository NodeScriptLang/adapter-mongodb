import { DomainDef } from '@nodescript/protocomm';

import { MongoDocument, MongoDocumentSchema } from '../schema/MongoDocument.js';
import { MongoFilter, MongoFilterSchema } from '../schema/MongoFilter.js';
import { MongoProjection, MongoProjectionSchema } from '../schema/MongoProjection.js';
import { MongoSort, MongoSortSchema } from '../schema/MongoSort.js';

export interface MongoDomain {

    connect(req: {
        url: string;
    }): Promise<{}>;

    findOne(req: {
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
    }): Promise<{
        document: MongoDocument | null;
    }>;

    findMany(req: {
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        sort?: MongoSort;
        limit?: number;
        skip?: number;
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
                url: { type: 'string' }
            },
            returns: {},
        },
        findOne: {
            type: 'command',
            params: {
                collection: { type: 'string' },
                filter: {
                    ...MongoFilterSchema.schema,
                },
                projection: {
                    ...MongoProjectionSchema.schema,
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
                collection: { type: 'string' },
                filter: {
                    ...MongoFilterSchema.schema,
                },
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
            },
            returns: {
                documents: {
                    type: 'array',
                    items: MongoDocumentSchema.schema,
                }
            }
        },
    },
    events: {},
};
