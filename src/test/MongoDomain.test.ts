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
            await runtime.Mongo.connect({
                url: runtime.testMongoDb.MONGO_URL,
            });
            const { document } = await runtime.Mongo.findOne({
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

});
