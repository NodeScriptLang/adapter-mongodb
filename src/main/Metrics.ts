import { CounterMetric, HistogramMetric, metric } from '@nodescript/metrics';

export class Metrics {

    @metric()
    connectionStats = new CounterMetric<{
        type: 'connect' | 'connectionCreated' | 'connectionClosed' | 'close' | 'fail';
    }>('nodescript_mongodb_adapter_connections', 'MongoDB adapter connections');

    @metric()
    methodLatency = new HistogramMetric<{
        domain: string;
        method: string;
        error?: string;
    }>('nodescript_mongodb_adapter_latency', 'MondoDB adapter method latency');

}
