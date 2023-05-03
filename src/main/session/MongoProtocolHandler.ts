import { MongoProtocol, mongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { HttpProtocolHandler } from '@nodescript/http-server';
import { dep } from 'mesh-ioc';

import { MongoProtocolImpl } from './MongoProtocolImpl.js';

export class MongoProtocolHandler extends HttpProtocolHandler<MongoProtocol> {
    protocol = mongoProtocol;

    @dep() protocolImpl!: MongoProtocolImpl;
}
