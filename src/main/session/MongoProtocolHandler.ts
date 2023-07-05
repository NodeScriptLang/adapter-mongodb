import { MongoProtocol, mongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { HttpProtocolHandler } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { Metrics } from '../Metrics.js';
import { MongoProtocolImpl } from './MongoProtocolImpl.js';

export class MongoProtocolHandler extends HttpProtocolHandler<MongoProtocol> {

    @dep() private metrics!: Metrics;

    @dep() protocolImpl!: MongoProtocolImpl;

    protocol = mongoProtocol;

    constructor() {
        super();
        this.methodStats.on(stats => {
            this.metrics.methodLatency.addMillis(stats.latency, {
                domain: stats.domain,
                method: stats.method,
                error: stats.error,
            });
        });
    }
}
