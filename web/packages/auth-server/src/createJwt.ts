import { SignJWT } from 'jose';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

async function signJwt(
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

export async function createJwt<TUser extends UserBase>(config: AuthConfigInitialized<TUser>, userId: string, expirationTime: string | number | Date = '1h') {
    return signJwt(
        userId,
        config.jwt.namespace,
        config.jwt.issuer,
        config.jwt.audience,
        expirationTime,
        await config.jwt.jwtSecretFactory());
}