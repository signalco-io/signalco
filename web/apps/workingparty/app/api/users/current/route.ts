import { usersPatch } from '../../../../src/lib/repository/usersRepository';
import { withAuth } from '../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
    return await withAuth(async ({ user }) => {
        return Response.json(user);
    });
}

export async function PATCH(request: Request) {
    return await withAuth(async ({ userId }) => {
        const body = await request.json();
        if (typeof body === 'object' && body && 'displayName' in body && typeof body.displayName === 'string') {
            if (body.displayName.length < 1) {
                return Response.json({ message: 'Display name must not be empty' }, { status: 400 });
            }

            await usersPatch(userId, {
                displayName: body.displayName
            });
        }

        return Response.json(null);
    });
}