import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function ensureAuthUserId<TUser extends UserBase>(authConfig: AuthConfigInitialized<TUser>) {
    const sessionCookie = cookies().get(authConfig.cookie.name);
    if (!sessionCookie?.value)
        throw new Error('Unauthorized');

    const result = await jwtVerify(sessionCookie.value, await authConfig.jwt.jwtSecretFactory(), {
        issuer: `urn:${authConfig.jwt.namespace}:issuer:${authConfig.jwt.issuer}`,
        audience: `urn:${authConfig.jwt.namespace}:audience:${authConfig.jwt.audience}`,
    });
    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0)
        throw new Error('Unauthorized');

    // TODO: Extract claims and return them as well
    return {
        userId
    };
}
