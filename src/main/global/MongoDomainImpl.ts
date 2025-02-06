import { MongoAggregate, MongoDocument, MongoDomain, MongoFilter, MongoProjection, MongoReadPreference, MongoSort, MongoUpdate } from '@nodescript/adapter-mongodb-protocol';
import { BSON, EJSON } from 'bson';
import { config } from 'mesh-config';
import { dep } from 'mesh-ioc';

import { ConnectionManager } from './ConnectionManager.js';
import { MemoryLimitError } from './CustomErrorHandler.js';

export class MongoDomainImpl implements MongoDomain {

    @dep() private connectionManager!: ConnectionManager;
    @config({ default: 100 * 1024 * 1024 })
        MEMORY_LIMIT!: number;

    async connect(req: {
        databaseUrl: string;
    }): Promise<{}> {
        await this.getConnection(req.databaseUrl);
        return {};
    }

    async findOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        readPreference?: MongoReadPreference;
    }): Promise<{ document: any }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const document = await col.findOne(filter, {
            projection: req.projection,
            readPreference: req.readPreference,
        });
        return {
            document: EJSON.serialize(document)
        };
    }

    async findMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        projection?: MongoProjection;
        sort?: MongoSort;
        limit?: number;
        skip?: number;
        readPreference?: MongoReadPreference;
    }): Promise<{ documents: any[] }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);

        const cursor = col.find(filter, {
            projection: req.projection,
            sort: req.sort,
            limit: req.limit,
            skip: req.skip,
            readPreference: req.readPreference,
        }).batchSize(500);

        const documents: any[] = [];
        let totalSize = 0;
        for await (const doc of cursor) {
            const docSize = BSON.serialize(doc).byteLength;
            if (totalSize + docSize >= this.MEMORY_LIMIT) {
                throw new MemoryLimitError('Memory limit exceeded. Cannot complete query.');
            }
            totalSize += docSize;
            documents.push(doc);
        }

        return {
            documents: EJSON.serialize(documents) as any[],
        };
    }

    async insertOne(req: {
        databaseUrl: string;
        collection: string;
        document: MongoDocument;
    }): Promise<{ insertedId: string }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const document = EJSON.deserialize(req.document);
        const res = await col.insertOne(document);
        return {
            insertedId: res.insertedId.toString(),
        };
    }

    async insertMany(req: {
        databaseUrl: string;
        collection: string;
        documents: any[];
    }): Promise<{ insertedIds: string[] }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const documents = EJSON.deserialize(req.documents);
        const res = await col.insertMany(documents);
        const insertedIds: string[] = [];
        for (let i = 0; i < res.insertedCount; i++) {
            insertedIds.push(res.insertedIds[i].toString());
        }
        return {
            insertedIds,
        };
    }

    async updateOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const update = EJSON.deserialize(req.update);
        const res = await col.updateOne(filter, update, { upsert: req.upsert });
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
            upsertedId: res.upsertedId?.toString(),
        };
    }

    async updateMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        update: MongoUpdate;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
    }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const update = EJSON.deserialize(req.update);
        const res = await col.updateMany(filter, update);
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
        };
    }

    async replaceOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
        replacement: any;
        upsert: boolean;
    }): Promise<{
        matchedCount: number;
        modifiedCount: number;
        upsertedId?: string;
    }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const replacement = EJSON.deserialize(req.replacement);
        const res = await col.replaceOne(filter, replacement, { upsert: req.upsert });
        return {
            matchedCount: res.matchedCount,
            modifiedCount: res.modifiedCount,
            upsertedId: res.upsertedId?.toString(),
        };
    }

    async deleteOne(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
    }): Promise<{ deletedCount: number }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const res = await col.deleteOne(filter);
        return {
            deletedCount: res.deletedCount,
        };
    }

    async deleteMany(req: {
        databaseUrl: string;
        collection: string;
        filter: MongoFilter;
    }): Promise<{ deletedCount: number }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const filter = EJSON.deserialize(req.filter);
        const res = await col.deleteMany(filter);
        return {
            deletedCount: res.deletedCount,
        };
    }

    async aggregate(req: {
        databaseUrl: string;
        collection: string;
        pipeline: MongoAggregate[];
        readPreference?: MongoReadPreference;
    }): Promise<{
        documents: any[];
    }> {
        const connection = await this.getConnection(req.databaseUrl);
        const col = connection.db().collection(req.collection);
        const pipeline = EJSON.deserialize(req.pipeline);
        const documents = await col.aggregate(pipeline, {
            allowDiskUse: true,
            readPreference: req.readPreference,
        }).toArray();
        return {
            documents: EJSON.serialize(documents) as any[]
        };
    }

    private async getConnection(databaseUrl: string) {
        const conn = this.connectionManager.getConnection(databaseUrl);
        await conn.connect();
        return conn;
    }

}
