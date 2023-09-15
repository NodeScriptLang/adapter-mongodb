import { dep, Mesh } from 'mesh-ioc';

import { App } from '../main/app.js';
import { ConnectionManager } from '../main/ConnectionManager.js';
import { MongoDomainImpl } from '../main/session/MongoDomainImpl.js';
import { TestMongoDb } from './TestMongoDb.js';

export class TestRuntime {
    app = new App();
    requestScope: Mesh = new Mesh();

    @dep({ cache: false }) Mongo!: MongoDomainImpl;
    @dep({ cache: false }) testMongoDb!: TestMongoDb;
    @dep({ cache: false }) connectionManager!: ConnectionManager;

    async setup() {
        this.app = new App();
        this.app.mesh.service(TestMongoDb);
        this.requestScope = this.app.createSessionScope();
        this.requestScope.connect(this);

        await this.app.start();
        await this.testMongoDb.start();
        await this.testMongoDb.db.dropDatabase();
    }

    async teardown() {
        await this.connectionManager.stop();
        await this.testMongoDb.stop();
        await this.app.stop();
    }

    get baseUrl() {
        return `http://localhost:${process.env.PORT ?? '8080'}`;
    }

}

export const runtime = new TestRuntime();
