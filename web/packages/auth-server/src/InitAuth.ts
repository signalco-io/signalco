import { WithAuthContext, withAuth } from './withAuth';
import { verifyToken } from './verifyToken';
import { setCookie } from './setCookie';
import { createJwt } from './createJwt';
import { clearCookie } from './clearCookie';
import { auth } from './auth';
import type { UserBase } from './@types/UserBase';
import type { AuthContext } from './@types/AuthContext';
import type { AuthConfigOverride } from './@types/AuthConfigOverride';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';
import type { AuthConfig } from './@types/AuthConfig';

export type initAuthResult<TUser extends UserBase> = {
    auth: () => Promise<AuthContext<TUser>>,
    withAuth: (handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) => Promise<Response>;
    createJwt: (userId: string, expirationTime?: string | number | Date, overrideConfig?: AuthConfigOverride<TUser>['jwt']) => Promise<string>;
    verifyJwt: (token: string, overrideConfig?: AuthConfigOverride<TUser>['jwt']) => ReturnType<typeof verifyToken>;
    setCookie: (cookieValue: Promise<string> | string, expiry?: number, overrideConfig?: AuthConfigOverride<TUser>['cookie']) => Promise<void>;
    clearCookie: (overrideConfig?: AuthConfigOverride<TUser>['cookie']) => Promise<void>;
}

export function initAuth<TUser extends UserBase>(config: AuthConfig<TUser>): initAuthResult<TUser> {
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
        auth: () =>
            auth(initializedConfig),
        withAuth: (handler) =>
            withAuth(initializedConfig, handler),
        createJwt: (userId: string, expirationTime?: string | number | Date, overrideConfig?: AuthConfigOverride<TUser>['jwt']) =>
            createJwt({ ...initializedConfig.jwt, ...overrideConfig }, userId, expirationTime),
        verifyJwt: (token: string, overrideConfig?: AuthConfigOverride<TUser>['jwt']) =>
            verifyToken({ ...initializedConfig.jwt, ...overrideConfig }, token),
        setCookie: (cookieValue: Promise<string> | string, expiry?: number, overrideConfig?: AuthConfigOverride<TUser>['cookie']) =>
            setCookie({ ...initializedConfig.cookie, ...overrideConfig }, cookieValue, expiry),
        clearCookie: (overrideConfig?: AuthConfigOverride<TUser>['cookie']) =>
            clearCookie({ ...initializedConfig.cookie, ...overrideConfig })
    };
}
