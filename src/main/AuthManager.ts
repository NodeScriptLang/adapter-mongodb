import { AccessDeniedError } from '@nodescript/errors';
import { config } from 'mesh-config';

export class AuthManager {

    @config({ default: '' }) AUTH_SECRET!: string;

    authenticate(secret: string) {
        if (this.AUTH_SECRET && secret !== this.AUTH_SECRET) {
            throw new AccessDeniedError('Incorrect secret');
        }
    }

}
