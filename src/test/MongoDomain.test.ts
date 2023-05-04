import assert from 'assert';

import { runtime } from './runtime.js';

describe('MongoDomain', () => {

    describe('findOne', () => {

        it('finds a document', async () => {
            await runtime.testMongoDb.db.collection<any>('users').insertOne({
                _id: 'joe',
                name: 'Joe',
                email: 'joeatlas@example.com',
            });
            const { document } = await runtime.Mongo.findOne({
                databaseUrl: runtime.testMongoDb.MONGO_URL,
                collection: 'users',
                filter: {
                    _id: 'joe',
                },
            });
            assert.deepStrictEqual(document, {
                _id: 'joe',
                name: 'Joe',
                email: 'joeatlas@example.com',
            });
        });

    });

    describe('EJSON', () => {

        it('uses EJSON to work with native types', async () => {
            await runtime.testMongoDb.db.collection<any>('users').insertOne({
                _id: 'joe',
                name: 'Joe',
                email: 'joeatlas@example.com',
                bornAt: new Date('2000-01-31T00:00:00Z'),
            });
            await runtime.testMongoDb.db.collection<any>('users').insertOne({
                _id: 'jane',
                name: 'Jane',
                email: 'janeatlas@example.com',
                bornAt: new Date('1999-01-01T00:00:00Z'),
            });
            const { documents } = await runtime.Mongo.findMany({
                databaseUrl: runtime.testMongoDb.MONGO_URL,
                collection: 'users',
                filter: {
                    bornAt: {
                        $lt: {
                            $date: '2000-01-01T00:00:00Z',
                        }
                    }
                },
            });
            assert.deepStrictEqual(documents, [
                {
                    _id: 'jane',
                    name: 'Jane',
                    email: 'janeatlas@example.com',
                    bornAt: {
                        $date: '1999-01-01T00:00:00Z',
                    }
                }
            ]);
        });

    });

});
