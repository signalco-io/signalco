import { cookies, headers } from 'next/headers';
import { jwtVerify } from 'jose';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export async function ensureAuthUserId<TUser extends UserBase>(authConfig: AuthConfigInitialized<TUser>) {
    const sessionCookie = (await cookies()).get(authConfig.cookie.name);
    let token = sessionCookie?.value;

    if (!token) {
        const authorizationHeader = (await headers()).get('Authorization');
        if (authorizationHeader?.startsWith('Bearer ')) {
            token = authorizationHeader.substring(7);
        }
    }

    if (!token) {
        throw new UnauthorizedError('Unauthorized: No token provided');
    }

    let result;
    try {
        result = await jwtVerify(token, await authConfig.jwt.jwtSecretFactory(), {
            issuer: `urn:${authConfig.jwt.namespace}:issuer:${authConfig.jwt.issuer}`,
            audience: `urn:${authConfig.jwt.namespace}:audience:${authConfig.jwt.audience}`,
        });
    } catch (error) {
        console.warn('JWT verification failed:', error);
        throw new UnauthorizedError('Unauthorized: Invalid token');
    }

    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0) {
        throw new UnauthorizedError('Unauthorized: Invalid user ID');
    }

    // TODO: Extract claims and return them as well
    return {
        userId
    };
}
