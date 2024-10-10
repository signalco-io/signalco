import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { UserBase, WithAuthContext, withAuth } from './withAuth';
import { AuthConfig } from './AuthConfig';

const defaultConfig = {
    namespace: 'app',
    issuer: 'api',
    audience: 'web',
    cookieName: 'auth_session',
    jwtSecretFactory: async () => { throw new Error('Not implemented'); },
    getUser: async () => { throw new Error('Not implemented'); }
};

async function createJwt(
    userId: string,
    namespace: string,
    issuer: string,
    audience: string,
    expirationTime: string | number | Date,
    jwtSecret: Uint8Array) {
    return await new SignJWT()
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(`urn:${namespace}:issuer:${issuer}`)
        .setAudience(`urn:${namespace}:audience:${audience}`)
        .setExpirationTime(expirationTime)
        .setSubject(userId)
        .sign(jwtSecret);
}

export function InitAuth<TUser extends UserBase>(config: AuthConfig<TUser>): {
    withAuth: (handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) => Promise<Response>;
    createJwt: (userId: string, expirationTime?: string | number | Date) => Promise<string>;
    setJwtCookie: (jwt: Promise<string> | string) => Promise<void>;
} {
    const initializedConfig = { ...defaultConfig, ...config };
    return {
        withAuth: (handler) => withAuth(initializedConfig, handler),
        createJwt: async (userId: string, expirationTime: string | number | Date = '1h') => await createJwt(
            userId,
            initializedConfig.namespace,
            initializedConfig.issuer,
            initializedConfig.audience,
            expirationTime,
            await initializedConfig.jwtSecretFactory()),
        setJwtCookie: async (jwt) => {
            cookies().set(initializedConfig.cookieName, await Promise.resolve(jwt), {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            });
        }
    };
}
