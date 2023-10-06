import { Schema } from 'airtight';

export enum MongoReadPreference {
    PRIMARY = 'primary',
    PRIMARY_PREFERRED = 'primaryPreferred',
    SECONDARY = 'secondary',
    SECONDARY_PREFERRED = 'secondaryPreferred',
    NEAREST = 'nearest',
}

export const MongoReadPreferenceSchema = new Schema<MongoReadPreference>({
    type: 'string',
    enum: Object.values(MongoReadPreference),
    default: MongoReadPreference.PRIMARY,
});
