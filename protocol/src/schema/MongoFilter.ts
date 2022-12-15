import { Schema } from 'airtight';

export type MongoFilter = Record<string, any>;

export const MongoFilterSchema = new Schema<MongoFilter>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
