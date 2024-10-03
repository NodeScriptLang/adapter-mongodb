export class MongoDbConnectionError extends Error {
    override name = this.constructor.name;
}
