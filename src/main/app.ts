import 'reflect-metadata';

import { HttpCorsHandler, HttpMetricsHandler, HttpServer, StandardHttpHandler } from '@nodescript/http-server';
import { Logger } from '@nodescript/logger';
import { BaseApp, StandardLogger } from '@nodescript/microservice';
import { Config, ProcessEnvConfig } from 'mesh-config';
import { dep, Mesh } from 'mesh-ioc';

import { AppHttpHandler } from './AppHttpHandler.js';
import { AuthManager } from './AuthManager.js';
import { ConnectionManager } from './ConnectionManager.js';
import { Metrics } from './Metrics.js';
import { MongoDomainImpl } from './session/MongoDomainImpl.js';
import { MongoProtocolHandler } from './session/MongoProtocolHandler.js';
import { MongoProtocolImpl } from './session/MongoProtocolImpl.js';
import { SessionContext } from './session/SessionContext.js';
import { WsHandler } from './session/WsHandler.js';
import { WsServer } from './WsServer.js';

export class App extends BaseApp {

    @dep() httpServer!: HttpServer;
    @dep() wsServer!: WsServer;
    @dep() connectionManager!: ConnectionManager;

    constructor() {
        super(new Mesh('App'));
        this.mesh.constant(HttpServer.SCOPE, () => this.createSessionScope());
        this.mesh.constant(WsServer.SCOPE, () => this.createSessionScope());
        this.mesh.service(Config, ProcessEnvConfig);
        this.mesh.service(Logger, StandardLogger);
        this.mesh.service(HttpServer);
        this.mesh.service(WsServer);
        this.mesh.service(Metrics);
        this.mesh.service(AuthManager);
        this.mesh.service(ConnectionManager);
        this.mesh.service(StandardHttpHandler);
        this.mesh.service(HttpCorsHandler);
        this.mesh.service(HttpMetricsHandler);
    }

    createSessionScope() {
        const mesh = new Mesh('Request');
        mesh.parent = this.mesh;
        mesh.service(HttpServer.HANDLER, AppHttpHandler);
        mesh.service(SessionContext);
        mesh.service(WsHandler);
        mesh.service(MongoDomainImpl);
        mesh.service(MongoProtocolImpl);
        mesh.service(MongoProtocolHandler);
        return mesh;
    }

    async start() {
        await this.connectionManager.start();
        await this.httpServer.start();
        await this.wsServer.start();
    }

    async stop() {
        await this.connectionManager.stop();
        await this.httpServer.stop();
        await this.wsServer.stop();
    }

}
