import { MongoProtocol } from '@nodescript/adapter-mongodb-protocol';
import { dep } from 'mesh-ioc';

import { MongoDomainImpl } from './MongoDomainImpl.js';

export class MongoProtocolImpl implements MongoProtocol {

    @dep() Mongo!: MongoDomainImpl;

}
