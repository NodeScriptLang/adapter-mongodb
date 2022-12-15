import { Schema } from 'airtight';

export type MongoDocument = any;

export const MongoDocumentSchema = new Schema<MongoDocument>({
    type: 'any'
});
