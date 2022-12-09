import { ProtocolIndex } from '@nodescript/protocomm';

import { MongoDomain } from './domains/MongoDomain.js';

export interface MongoProtocol {
    Mongo: MongoDomain;
}

export const mongoProtocol = new ProtocolIndex<MongoProtocol>({
    Mongo: MongoDomain,
});
