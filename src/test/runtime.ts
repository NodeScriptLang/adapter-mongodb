import { dep, Mesh } from '@nodescript/mesh';
import { config } from 'dotenv';

import { App } from '../main/app.js';
import { MongoDomainImpl } from '../main/session/MongoDomainImpl.js';
import { SessionContext } from '../main/session/SessionContext.js';
import { TestMongoDb } from './TestMongoDb.js';

config({ path: '.env' });
config({ path: '.env.test' });

export class TestRuntime {
    app = new App();
    requestScope: Mesh = new Mesh();

    @dep({ cache: false }) Mongo!: MongoDomainImpl;
    @dep({ cache: false }) testMongoDb!: TestMongoDb;
    @dep({ cache: false }) sessionContext!: SessionContext;

    async setup() {
        this.app = new App();
        this.app.mesh.service(TestMongoDb);
        this.requestScope = this.app.createSessionScope();
        this.requestScope.connect(this);

        await this.testMongoDb.start();
        await this.app.start();
        await this.testMongoDb.db.dropDatabase();
    }

    async teardown() {
        await this.sessionContext.destroy();
        await this.testMongoDb.stop();
        await this.app.stop();
    }

    get baseUrl() {
        return `http://localhost:${process.env.PORT ?? '8080'}`;
    }

}

export const runtime = new TestRuntime();
