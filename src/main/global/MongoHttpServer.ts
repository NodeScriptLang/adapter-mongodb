import { HttpContext, HttpNext, HttpServer } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { MongoHttpHandler } from './MongoHttpHandler.js';

export class MongoHttpServer extends HttpServer {

    @dep() private handler!: MongoHttpHandler;

    async handle(ctx: HttpContext, next: HttpNext): Promise<void> {
        await this.handler.handle(ctx, next);
    }

}
