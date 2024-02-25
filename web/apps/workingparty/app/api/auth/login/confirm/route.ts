import { SignJWT } from 'jose';

async function createJwt() {
    const signSecret = process.env.WP_JWT_SIGN_SECRET;
    const secret = new TextEncoder().encode(signSecret);

    return await new SignJWT({ 'urn:example:claim': true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(secret);
}

export async function POST(request: Request) {
    const json = await request.json();
    let email: string | undefined = undefined;
    if (json && typeof json === 'object' && 'email' in json && typeof json.email === 'string') {
        email = json.email;
    }
    if (!email)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    let token: string | undefined = undefined;
    if (json && typeof json === 'object' && 'token' in json && typeof json.token === 'string') {
        token = json.token;
    }
    if (!token)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    const userId = '12345';

    return Response.json({
        userId: userId,
        accessToken: await createJwt()
    });
}
