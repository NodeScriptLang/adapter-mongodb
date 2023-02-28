import { MongoAggregate, MongoDocument, MongoDomain, MongoFilter, MongoProjection, MongoSort, MongoUpdate } from '@nodescript/adapter-mongodb-protocol';
import { AccessDeniedError } from '@nodescript/errors';
import { config } from 'mesh-config';
import { dep } from 'mesh-ioc';

import { SessionContext } from './SessionContext.js';

export class MongoDomainImpl implements MongoDomain {

    @config({ default: '' }) AUTH_SECRET!: string;

    @dep() sessionContext!: SessionContext;

    async connect(req: {
        url: string;
        secret: string;
    }): Promise<{}> {
        if (this.AUTH_SECRET && req.secret !== this.AUTH_SECRET) {
            throw new AccessDeniedError('Incorrect secret');
        }
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
        const document = await col.findOne(req.filter, {
            projection: req.projection,
        });
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
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const documents = await col.find(req.filter, {
            projection: req.projection,
            sort: req.sort,
            limit: req.limit,
            skip: req.skip,
        }).toArray();
        return { documents };
    }

    async insertOne(req: {
        collection: string;
        document: MongoDocument;
    }): Promise<{ insertedId: string }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.insertOne(req.document);
        return { insertedId: res.insertedId.toString() };
    }

    async insertMany(req: { collection: string; documents: any[] }): Promise<{ insertedIds: string[] }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.insertMany(req.documents);
        const insertedIds: string[] = [];
        for (let i = 0; i < res.insertedCount; i++) {
            insertedIds.push(res.insertedIds[i].toString());
        }
        return { insertedIds };
    }

    async updateOne(req: {
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.updateOne(req.filter, req.update, { upsert: req.upsert });
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
            upsertedId: res.upsertedId?.toString(),
        };
    }

    async updateMany(req: {
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
    }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.updateMany(req.filter, req.update);
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
        };
    }

    async replaceOne(req: {
        collection: string;
        filter: MongoFilter;
        replacement: any;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.replaceOne(req.filter, req.replacement, { upsert: req.upsert });
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
            upsertedId: res.upsertedId?.toString(),
        };
    }

    async deleteOne(req: { collection: string; filter: MongoFilter }): Promise<{ deletedCount: number }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.deleteOne(req.filter);
        return {
            deletedCount: res.deletedCount,
        };
    }

    async deleteMany(req: { collection: string; filter: MongoFilter }): Promise<{ deletedCount: number }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const res = await col.deleteMany(req.filter);
        return {
            deletedCount: res.deletedCount,
        };
    }

    async aggregate(req: {
        collection: string;
        pipeline: MongoAggregate[];
    }): Promise<{
        documents: any[];
    }> {
        const connection = this.sessionContext.requireConnection();
        const col = connection.db().collection(req.collection);
        const documents = await col.aggregate(req.pipeline).toArray();
        return {
            documents,
        };
    }

}
