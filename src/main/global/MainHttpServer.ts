import { HttpChain, HttpContext, HttpCorsHandler, HttpMetricsHandler, HttpNext, HttpServer, StandardHttpHandler } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { AuthHandler } from './AuthHandler.js';
import { CustomErrorHandler } from './CustomErrorHandler.js';
import { MongoProtocolHandler } from './MongoProtocolHandler.js';

export class MainHttpServer extends HttpServer {

    @dep() private standardHttpHandler!: StandardHttpHandler;
    @dep() private corsHandler!: HttpCorsHandler;
    @dep() private metricsHandler!: HttpMetricsHandler;
    @dep() private authHandler!: AuthHandler;
    @dep() private customErrorHandler!: CustomErrorHandler;
    @dep() private mongoProtocolHandler!: MongoProtocolHandler;

    handler = new HttpChain([
        this.standardHttpHandler,
        this.corsHandler,
        this.metricsHandler,
        this.authHandler,
        this.customErrorHandler,
        this.mongoProtocolHandler,
    ]);

    async handle(ctx: HttpContext, next: HttpNext): Promise<void> {
        await this.handler.handle(ctx, next);
    }

}
