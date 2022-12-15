import { Schema } from 'airtight';

export type MongoUpdate = Record<string, any>;

export const MongoUpdateSchema = new Schema<MongoUpdate>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
