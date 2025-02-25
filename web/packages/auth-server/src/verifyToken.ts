import { jwtVerify } from 'jose';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function verifyToken<TUser extends UserBase>(authConfig: AuthConfigInitialized<TUser>['jwt'], token: string) {
    try {
        return {
            result: await jwtVerify(token, await authConfig.jwtSecretFactory(), {
                issuer: 'urn:auth-server:issuer:auth-server',
                audience: 'urn:auth-server:audience:auth-server',
            })
        };
    } catch (error) {
        return {
            error
        };
    }
}
