import { HttpContext, HttpHandler, HttpNext } from '@nodescript/http-server';
import { MongoError } from 'mongodb';

export class CustomErrorHandler implements HttpHandler {

    async handle(ctx: HttpContext, next: HttpNext): Promise<void> {
        try {
            await next();
        } catch (error: any) {
            if (error instanceof MongoError) {
                throw new WrappedMongoError(error);
            }
            throw error;
        }
    }

}

export class WrappedMongoError extends Error {
    override name = 'MongoError';
    status = 500;
    details: any;

    constructor(err: MongoError) {
        super(err.message);
        this.details = {
            code: err.code,
        };
    }

}
