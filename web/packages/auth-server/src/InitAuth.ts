import { WithAuthContext, withAuth } from './withAuth';
import { setCookie } from './setCookie';
import { createJwt } from './createJwt';
import { clearCookie } from './clearCookie';
import { auth } from './auth';
import type { UserBase } from './@types/UserBase';
import type { AuthContext } from './@types/AuthContext';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';
import type { AuthConfig } from './@types/AuthConfig';

export function initAuth<TUser extends UserBase>(config: AuthConfig<TUser>): {
    auth: () => Promise<AuthContext<TUser>>,
    withAuth: (handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) => Promise<Response>;
    createJwt: (userId: string, expirationTime?: string | number | Date) => Promise<string>;
    setCookie: (cookieValue: Promise<string> | string, expiry?: number) => Promise<void>;
    clearCookie: () => Promise<void>;
} {
    const initializedConfig: AuthConfigInitialized<TUser> = {
        ...{
            getUser: async () => { throw new Error('Not implemented'); }
        },
        ...config,
        security: {
            expiry: 60 * 60 * 1000,
            ...config.security
        },
        jwt: {
            namespace: 'app',
            issuer: 'api',
            audience: 'web',
            jwtSecretFactory: async () => { throw new Error('Not implemented'); },
            expiry: config.security?.expiry ?? 60 * 60 * 1000,
            ...config.jwt
        },
        cookie: {
            ...{
                name: 'auth_session',
                expiry: config.security?.expiry ?? 60 * 60 * 1000
            },
            ...config.cookie
        }
    };
    return {
        auth: () => auth(initializedConfig),
        withAuth: (handler) => withAuth(initializedConfig, handler),
        createJwt: (userId: string, expirationTime?: string | number | Date) => createJwt(initializedConfig, userId, expirationTime),
        setCookie: (cookieValue: Promise<string> | string, expiry?: number) => setCookie(initializedConfig, cookieValue, expiry),
        clearCookie: () => clearCookie(initializedConfig)
    };
}
