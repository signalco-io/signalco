import { usersGet } from '../repository/usersRepository';
import { ensureAuthUserId } from './ensureAuthUserId';

export async function withAuth(handler: (ctx: { userId: string, accountId: string }) => Promise<Response>) {
    const userIdOrResponse = await ensureAuthUserId();
    if (userIdOrResponse instanceof Response)
        return userIdOrResponse;
    const accountId = (await usersGet(userIdOrResponse)).accountIds[0];
    if (!accountId)
        return Response.json({ error: 'No account found for user' }, { status: 404 });

    return await handler({
        userId: userIdOrResponse,
        accountId
    });
}