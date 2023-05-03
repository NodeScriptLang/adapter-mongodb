import { HttpChain, HttpCorsHandler, HttpHandler, HttpMetricsHandler, StandardHttpHandler } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { MongoProtocolHandler } from './session/MongoProtocolHandler.js';

export class AppHttpHandler extends HttpChain {

    @dep() private standardHttpHandler!: StandardHttpHandler;
    @dep() private corsHandler!: HttpCorsHandler;
    @dep() private metricsHandler!: HttpMetricsHandler;
    @dep() private mongoProtocolHandler!: MongoProtocolHandler;

    handlers: HttpHandler[] = [
        this.standardHttpHandler,
        this.corsHandler,
        this.metricsHandler,
        this.mongoProtocolHandler,
    ];

}
