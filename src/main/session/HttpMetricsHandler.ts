import { HttpContext, HttpHandler, HttpNext } from '@nodescript/http-server';
import { generateMetricsReport } from '@nodescript/metrics';
import { dep, Mesh } from 'mesh-ioc';

export class HttpMetricsHandler implements HttpHandler {

    @dep() private mesh!: Mesh;

    async handle(ctx: HttpContext, next: HttpNext) {
        if (ctx.method === 'GET' && ctx.path === '/metrics') {
            const report = generateMetricsReport(this.mesh);
            ctx.requestBody = report;
            return;
        }
        return next();
    }
}
