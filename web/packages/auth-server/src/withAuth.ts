import { auth } from './auth';
import type { UserBase } from './@types/UserBase';
import type { AuthContext } from './@types/AuthContext';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export type WithAuthContext<TUser extends UserBase> = AuthContext<TUser>;

export async function withAuth<TUser extends UserBase>(
    config: AuthConfigInitialized<TUser>,
    handler: (ctx: WithAuthContext<TUser>) => Promise<Response>): Promise<Response> {
    try {
        const authContext = await auth(config);
        return await handler(authContext);
    } catch {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
}