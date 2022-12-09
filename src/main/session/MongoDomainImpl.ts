import { MongoDomain, MongoFilter, MongoProjection, MongoSort } from '@nodescript/adapter-mongodb-protocol';
import { dep } from '@nodescript/mesh';

import { SessionContext } from './SessionContext.js';

export class MongoDomainImpl implements MongoDomain {

    @dep() sessionContext!: SessionContext;

    async connect(req: {
        url: string;
    }): Promise<{}> {
        await this.sessionContext.connect(req.url);
        return {};
    }

    async findOne(req: {
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
    }): Promise<{ document: any }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const document = await col.findOne(req.filter, req.projection);
        return { document };
    }

    async findMany(req: {
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        sort?: MongoSort;
        limit?: number;
        skip?: number;
    }): Promise<{ documents: any[] }> {
        throw new Error('Method not implemented.');
    }

}
