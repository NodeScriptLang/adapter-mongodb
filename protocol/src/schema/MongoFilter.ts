import { Schema } from '@nodescript/schema';

export type MongoFilter = Record<string, any>;

export const MongoFilterSchema = new Schema<MongoFilter>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
