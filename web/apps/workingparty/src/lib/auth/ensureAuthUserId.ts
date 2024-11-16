import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { jwtSecret } from './jwtSecret';

export type AuthConfig = {
    namespace: string;
    issuer: string;
    audience: string;
    cookieName: string;
    jwtSecretFactory: () => Promise<Uint8Array>;
}

export const authConfig: AuthConfig = {
    namespace: 'workingparty',
    issuer: 'api',
    audience: 'web',
    cookieName: 'wp_session',
    jwtSecretFactory: async () => jwtSecret(),
}

export async function ensureAuthUserId() {
    const sessionCookie = (await cookies()).get(authConfig.cookieName);
    if (!sessionCookie?.value)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await jwtVerify(sessionCookie.value, jwtSecret(), {
        issuer: `urn:${authConfig.namespace}:issuer:${authConfig.issuer}`,
        audience: `urn:${authConfig.namespace}:audience:${authConfig.audience}`,
    });
    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // TODO: Extract claims and return them as well

    return {
        userId
    };
}