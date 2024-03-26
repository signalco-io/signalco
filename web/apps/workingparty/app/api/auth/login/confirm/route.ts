import { cookies } from 'next/headers';
import { usersAssignAccount, usersCreate, usersGetByEmail } from '../../../../../src/lib/repository/usersRepository';
import { loginRequestsVerify } from '../../../../../src/lib/repository/loginRequests';
import { accountCreate } from '../../../../../src/lib/repository/accountsRepository';
import { createJwt } from '../../../../../src/lib/auth/createJwt';

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

    if (!await loginRequestsVerify(email, token))
        return Response.json({ error: 'Invalid token' }, { status: 400 });

    // Create user if not exists
    let userId = (await usersGetByEmail(email));
    if (!userId) {
        const createdUserId = await usersCreate({ email });
        const createdAccount = await accountCreate({ name: `${email}'s Account`, email: email });
        await usersAssignAccount(createdUserId, createdAccount);
        userId = createdUserId;
    }

    const jwt = await createJwt(userId);

    // Set header for JWT
    cookies().set('wp_session', jwt, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
    });

    return Response.json({
        userId: userId
    });
}
