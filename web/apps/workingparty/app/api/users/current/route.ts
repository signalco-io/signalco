import { ensureAuthUserId } from '../../workers/route';
import { usersGet } from '../../../../src/lib/repository/usersRepository';

export async function GET() {
    const userIdOrResponse = await ensureAuthUserId();
    if (userIdOrResponse instanceof Response)
        return userIdOrResponse;
    const user = await usersGet(userIdOrResponse);
    return Response.json(user);
}