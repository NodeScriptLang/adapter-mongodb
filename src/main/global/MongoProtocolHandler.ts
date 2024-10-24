import { MongoProtocol, mongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { HttpProtocolHandler } from '@nodescript/http-server';
import { HistogramMetric, metric } from '@nodescript/metrics';
import { dep } from 'mesh-ioc';

import { MongoProtocolImpl } from './MongoProtocolImpl.js';

export class MongoProtocolHandler extends HttpProtocolHandler<MongoProtocol> {

    @dep() protocolImpl!: MongoProtocolImpl;

    protocol = mongoProtocol;

    @metric()
    private methodLatency = new HistogramMetric<{
        domain: string;
        method: string;
        error?: string;
    }>('nodescript_mongodb_adapter_latency', 'MondoDB adapter method latency');

    constructor() {
        super();
        this.methodStats.on(stats => {
            this.methodLatency.addMillis(stats.latency, {
                domain: stats.domain,
                method: stats.method,
                error: stats.error,
            });
        });
    }

}
