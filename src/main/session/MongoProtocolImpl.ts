import { MongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { dep } from '@nodescript/mesh';

import { MongoDomainImpl } from './MongoDomainImpl.js';

export class MongoProtocolImpl implements MongoProtocol {
    @dep() Mongo!: MongoDomainImpl;
}
