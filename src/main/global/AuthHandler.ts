import { AccessDeniedError } from '@nodescript/errors';
import { HttpContext, HttpHandler, HttpNext } from '@nodescript/http-server';
import { config } from 'mesh-config';

export class AuthHandler implements HttpHandler {

    @config({ default: '' }) AUTH_SECRET!: string;

    async handle(ctx: HttpContext, next: HttpNext) {
        if (this.AUTH_SECRET) {
            const token = ctx.getRequestHeader('Authorization', '')
                .replace(/^bearer\s+/gi, '');
            if (token !== this.AUTH_SECRET) {
                throw new AccessDeniedError('Incorrect secret');
            }
        }
        return next();
    }

}
