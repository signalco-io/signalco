import { cookies, headers } from 'next/headers';
import { verifyToken } from './verifyToken';
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
        if (authorizationHeader?.toLowerCase().startsWith('bearer ')) {
            token = authorizationHeader.substring(7);
        }
    }

    if (!token) {
        throw new UnauthorizedError('Unauthorized: No token provided');
    }

    const verify = await verifyToken(authConfig.jwt, token);
    if (verify.error) {
        console.error('JWT verification error:', verify.error);
        throw new UnauthorizedError('Unauthorized: Invalid token');
    }

    const userId = verify.result?.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0) {
        throw new UnauthorizedError('Unauthorized: Invalid user ID');
    }

    // TODO: Extract claims and return them as well
    return {
        userId
    };
}
