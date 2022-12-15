import { RequestHandler } from '@nodescript/http-server';
import { generateMetricsReport } from '@nodescript/metrics';
import { Context, Next } from 'koa';
import { dep, Mesh } from 'mesh-ioc';

export class HttpMetricsHandler implements RequestHandler {

    @dep() private mesh!: Mesh;

    async handle(ctx: Context, next: Next) {
        if (ctx.method === 'GET' && ctx.path === '/metrics') {
            const report = generateMetricsReport(this.mesh);
            ctx.body = report;
            return;
        }
        return next();
    }
}
