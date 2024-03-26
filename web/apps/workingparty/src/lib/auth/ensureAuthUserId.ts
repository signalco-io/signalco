import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { jwtSecret } from './jwtSecret';

export async function ensureAuthUserId() {
    const sessionCookie = cookies().get('wp_session');
    if (!sessionCookie?.value)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await jwtVerify(sessionCookie.value, jwtSecret(), {
        issuer: 'urn:workingparty:issuer:api',
        audience: 'urn:workingparty:audience:web',
    });
    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    return userId;
}