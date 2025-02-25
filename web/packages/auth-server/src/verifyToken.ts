import { jwtVerify } from 'jose';
import type { UserBase } from './@types/UserBase';
import { JWTPayload } from './@types/JWTPayload';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function verifyToken<TUser extends UserBase>(authConfig: AuthConfigInitialized<TUser>['jwt'], token: string): Promise<{
    result?: {
        payload: JWTPayload
    };
    error?: unknown;
}> {
    try {
        return {
            result: await jwtVerify(token, await authConfig.jwtSecretFactory(), {
                issuer: `urn:${authConfig.namespace}:issuer:${authConfig.issuer}`,
                audience: `urn:${authConfig.namespace}:audience:${authConfig.audience}`,
            })
        };
    } catch (error) {
        return {
            error
        };
    }
}
