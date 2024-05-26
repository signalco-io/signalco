import { InitAuth } from '@signalco/auth-server';
import { DbUser } from '../db/schema';
import { cosmosDataContainerUsers } from '../db/client';

function jwtSecret() {
    const signSecret = process.env.WP_JWT_SIGN_SECRET;
    return new TextEncoder().encode(signSecret);
}

async function getUser(id: string) {
    return (await cosmosDataContainerUsers().item(id, id).read<DbUser>()).resource;
}

export const { withAuth } = InitAuth({
    namespace: 'doprocess',
    cookieName: 'dp_session',
    jwtSecretFactory: async () => jwtSecret(),
    getUser
});