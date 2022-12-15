import { Schema } from 'airtight';

export type MongoProjection = Record<string, any>;

export const MongoProjectionSchema = new Schema<MongoProjection>({
    type: 'object',
    properties: {},
    additionalProperties: { type: 'any' },
});
