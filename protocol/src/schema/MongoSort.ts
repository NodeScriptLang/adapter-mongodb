import { Schema } from 'airtight';

export type MongoSort = Record<string, any>;

export const MongoSortSchema = new Schema<MongoSort>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
