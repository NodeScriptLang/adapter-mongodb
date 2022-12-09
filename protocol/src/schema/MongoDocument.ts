import { Schema } from '@nodescript/schema';

export type MongoDocument = any;

export const MongoDocumentSchema = new Schema<MongoDocument>({
    type: 'any'
});
