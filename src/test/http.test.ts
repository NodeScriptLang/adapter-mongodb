import assert from 'assert';

import { runtime } from './runtime.js';

describe('HTTP', () => {

    beforeEach(() => runtime.setup());
    afterEach(() => runtime.teardown());

    it('presents MongoError correctly', async () => {
        const res = await fetch(runtime.baseUrl + '/Mongo/updateOne', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                databaseUrl: runtime.testMongoDb.MONGO_URL,
                collection: 'foo',
                filter: {},
                update: {},
                upsert: false,
            }),
        });
        const body = await res.json();
        assert.strictEqual(body.name, 'MongoError');
    });

});
