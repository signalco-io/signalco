import { usersGet, usersPatch } from '../../../../src/lib/repository/usersRepository';
import { ensureAuthUserId } from '../../../../src/lib/auth/ensureAuthUserId';

export async function GET() {
    const userIdOrResponse = await ensureAuthUserId();
    if (userIdOrResponse instanceof Response)
        return userIdOrResponse;
    const user = await usersGet(userIdOrResponse);
    return Response.json(user);
}

export async function PATCH(request: Request) {
    const userIdOrResponse = await ensureAuthUserId();
    if (userIdOrResponse instanceof Response)
        return userIdOrResponse;

    const body = await request.json();
    if (typeof body === 'object' && body && 'displayName' in body && typeof body.displayName === 'string') {
        if (body.displayName.length < 1) {
            return Response.json({ message: 'Display name must not be empty' }, { status: 400 });
        }

        await usersPatch(userIdOrResponse, {
            displayName: body.displayName
        });
    }

    return Response.json(null);
}