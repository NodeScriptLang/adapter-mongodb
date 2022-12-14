import { Schema } from '@nodescript/schema';

export type MongoUpdate = Record<string, any>;

export const MongoUpdateSchema = new Schema<MongoUpdate>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
