import { initAuth } from '@signalco/auth-server';
import { DbUser } from '../db/schema';
import { cosmosDataContainerUsers } from '../db/client';

function jwtSecret() {
    const signSecret = process.env.DP_JWT_SIGN_SECRET as string;
    return Buffer.from(signSecret, 'base64');
}

async function getUser(id: string) {
    return (await cosmosDataContainerUsers().item(id, id).read<DbUser>()).resource;
}

export const { withAuth, clearCookie } = initAuth({
    jwt: {
        namespace: 'doprocess',
        jwtSecretFactory: async () => jwtSecret(),
    },
    cookie: {
        name: 'dp_session',
    },
    getUser
});