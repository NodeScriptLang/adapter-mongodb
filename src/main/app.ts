import 'reflect-metadata';

import { HttpCorsHandler, HttpMetricsHandler, HttpServer, StandardHttpHandler } from '@nodescript/http-server';
import { Logger } from '@nodescript/logger';
import { BaseApp, StandardLogger } from '@nodescript/microframework';
import { Config, ProcessEnvConfig } from 'mesh-config';
import { dep, Mesh } from 'mesh-ioc';

import { AuthHandler } from './global/AuthHandler.js';
import { ConnectionManager } from './global/ConnectionManager.js';
import { CustomErrorHandler } from './global/CustomErrorHandler.js';
import { MainHttpServer } from './global/MainHttpServer.js';
import { Metrics } from './global/Metrics.js';
import { MongoDomainImpl } from './global/MongoDomainImpl.js';
import { MongoProtocolHandler } from './global/MongoProtocolHandler.js';
import { MongoProtocolImpl } from './global/MongoProtocolImpl.js';

export class App extends BaseApp {

    @dep() httpServer!: HttpServer;
    @dep() connectionManager!: ConnectionManager;

    constructor() {
        super(new Mesh('App'));
        this.mesh.service(Config, ProcessEnvConfig);
        this.mesh.service(Logger, StandardLogger);
        this.mesh.service(Metrics);
        this.mesh.service(AuthHandler);
        this.mesh.service(HttpServer, MainHttpServer);
        this.mesh.service(StandardHttpHandler);
        this.mesh.service(HttpCorsHandler);
        this.mesh.service(HttpMetricsHandler);
        this.mesh.service(CustomErrorHandler);
        this.mesh.service(ConnectionManager);
        this.mesh.service(MongoDomainImpl);
        this.mesh.service(MongoProtocolHandler);
        this.mesh.service(MongoProtocolImpl);
    }

    override async start() {
        await super.start();
        await this.connectionManager.start();
        await this.httpServer.start();
    }

    override async stop() {
        await super.stop();
        await this.connectionManager.stop();
        await this.httpServer.stop();
    }

}
