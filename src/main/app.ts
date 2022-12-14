import 'reflect-metadata';

import { Config, ProcessEnvConfig } from '@nodescript/config';
import { HttpServer } from '@nodescript/http-server';
import { Logger } from '@nodescript/logger';
import { dep, Mesh } from '@nodescript/mesh';
import { BaseApp, StandardLogger } from '@nodescript/microservice';

import { Metrics } from './Metrics.js';
import { MongoDomainImpl } from './session/MongoDomainImpl.js';
import { MongoProtocolImpl } from './session/MongoProtocolImpl.js';
import { SessionContext } from './session/SessionContext.js';
import { WsHandler } from './session/WsHandler.js';
import { WsServer } from './WsServer.js';

export class App extends BaseApp {

    @dep() httpServer!: HttpServer;
    @dep() wsServer!: WsServer;

    constructor() {
        super(new Mesh('App'));
        this.mesh.constant('httpRequestScope', () => this.createSessionScope());
        this.mesh.constant('webSocketScope', () => this.createSessionScope());
        this.mesh.service(Config, ProcessEnvConfig);
        this.mesh.service(Logger, StandardLogger);
        this.mesh.service(HttpServer);
        this.mesh.service(WsServer);
        this.mesh.service(Metrics);
    }

    createSessionScope() {
        const mesh = new Mesh('Request');
        mesh.parent = this.mesh;
        mesh.service(SessionContext);
        mesh.service(WsHandler);
        mesh.service(MongoDomainImpl);
        mesh.service(MongoProtocolImpl);
        return mesh;
    }

    async start() {
        await this.httpServer.start();
        await this.wsServer.start();
    }

    async stop() {
        await this.httpServer.stop();
        await this.wsServer.stop();
    }

}
