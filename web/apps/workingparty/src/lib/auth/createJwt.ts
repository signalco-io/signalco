import { SignJWT } from 'jose';
import { jwtSecret } from './jwtSecret';

export async function createJwt(userId: string) {
    return await new SignJWT({ 'urn:example:claim': true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('urn:workingparty:issuer:api')
        .setAudience('urn:workingparty:audience:web')
        .setExpirationTime('2h')
        .setSubject(userId)
        .sign(jwtSecret());
}