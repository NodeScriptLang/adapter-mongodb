import { Schema } from '@nodescript/schema';

export type MongoAggregate = Record<string, any>;

export const MongoAggregateSchema = new Schema<MongoAggregate>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
