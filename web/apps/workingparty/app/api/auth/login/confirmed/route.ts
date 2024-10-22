import { cookies } from 'next/headers';
import { sanitizeEmail } from '@signalco/js';
import { usersAssignAccount, usersCreate, usersGetByEmail } from '../../../../../src/lib/repository/usersRepository';
import { loginRequestsUse } from '../../../../../src/lib/repository/loginRequests';
import { accountCreate } from '../../../../../src/lib/repository/accountsRepository';
import { authConfig } from '../../../../../src/lib/auth/ensureAuthUserId';
import { createJwt } from '../../../../../src/lib/auth/createJwt';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const json = await request.json();
    let email: string | undefined = undefined;
    if (json && typeof json === 'object' && 'email' in json && typeof json.email === 'string') {
        email = json.email;
    }
    if (!email)
        return Response.json({ error: 'Invalid request' }, { status: 400 });
    const emailSanitized = sanitizeEmail(email);

    let clientToken: string | undefined = undefined;
    if (json && typeof json === 'object' && 'clientToken' in json && typeof json.clientToken === 'string') {
        clientToken = json.clientToken;
    }
    if (!clientToken)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    const verifiedEmail = await loginRequestsUse(clientToken);
    if (!verifiedEmail)
        return Response.json({ error: 'Not verified yet' }, { status: 202 });

    // Create user if not exists
    let userId = (await usersGetByEmail(emailSanitized));
    if (!userId) {
        const createdUserId = await usersCreate({ email: emailSanitized });
        const createdAccount = await accountCreate({ name: `${emailSanitized}'s Account`, email: emailSanitized });
        await usersAssignAccount(createdUserId, createdAccount);
        userId = createdUserId;
    }

    const jwt = await createJwt(
        userId,
        authConfig.namespace,
        authConfig.issuer,
        authConfig.audience,
        '1h',
        await authConfig.jwtSecretFactory());

    // Set header for JWT
    (await cookies()).set('wp_session', jwt, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
    });

    return Response.json({
        userId: userId
    });
}
