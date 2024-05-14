import { DbUser, usersGet } from '../repository/usersRepository';
import { ensureAuthUserId } from './ensureAuthUserId';

export async function withAuth(handler: (ctx: { userId: string, user: DbUser, accountId: string }) => Promise<Response>) {
    const userInfoOrResponse = await ensureAuthUserId();
    if (userInfoOrResponse instanceof Response)
        return userInfoOrResponse;
    const user = await usersGet(userInfoOrResponse.userId);
    if (!user)
        return Response.json({ error: 'User not found' }, { status: 404 });

    // TODO: Extract active account from cookie
    const accountId = user.accountIds[0];
    if (!accountId)
        return Response.json({ error: 'No account found for user' }, { status: 404 });

    return await handler({
        userId: userInfoOrResponse.userId,
        user,
        accountId
    });
}