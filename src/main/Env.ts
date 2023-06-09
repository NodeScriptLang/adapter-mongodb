import { config } from 'mesh-config';

export class Env {

    @config({ default: 'nodescript-mongodb-adapter' }) APP_ID!: string;

}
