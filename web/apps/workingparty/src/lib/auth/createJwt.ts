import { SignJWT } from 'jose';

/**
 * Create a JWT token.
 * @param userId The user ID (subject)
 * @param namespace The namespace (usually the app name)
 * @param issuer The issuer (eg. `api`, etc.)
 * @param audience The audience (eg. `web`, etc.)
 * @param expirationTime The expiration time (eg. `1h`, `2h`, etc.)
 * @param jwtSecret The encoded JWT secret.
 * @returns The signed JWT token string.
 */
export async function createJwt(
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