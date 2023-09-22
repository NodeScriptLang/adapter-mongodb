import { HttpChain, HttpCorsHandler, HttpHandler, HttpMetricsHandler, StandardHttpHandler } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { AuthHandler } from './AuthHandler.js';
import { CustomErrorHandler } from './CustomErrorHandler.js';
import { MongoProtocolHandler } from './MongoProtocolHandler.js';

export class AppHttpHandler extends HttpChain {

    @dep() private standardHttpHandler!: StandardHttpHandler;
    @dep() private corsHandler!: HttpCorsHandler;
    @dep() private metricsHandler!: HttpMetricsHandler;
    @dep() private authHandler!: AuthHandler;
    @dep() private customErrorHandler!: CustomErrorHandler;
    @dep() private mongoProtocolHandler!: MongoProtocolHandler;

    handlers: HttpHandler[] = [
        this.standardHttpHandler,
        this.corsHandler,
        this.metricsHandler,
        this.authHandler,
        this.customErrorHandler,
        this.mongoProtocolHandler,
    ];

}
