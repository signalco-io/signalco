import { WithAuthContext } from './withAuth';
import { initAuth } from './InitAuth';
import { RbacUserBase } from './@types/RbacUserBase';

function checkRole<TUser extends RbacUserBase>(roles: string[], user: TUser) {
    if (!roles.includes(user.role)) {
        throw new Error('Unauthorized');
    }
}

export function initRbac<TUser extends RbacUserBase>({ withAuth: authWithAuth, auth: authAuth, ...rest }: ReturnType<typeof initAuth<TUser>>) {
    async function auth(roles: string[]) {
        const authResult = await authAuth();
        checkRole(roles, authResult.user);
        return authResult;
    }

    async function withAuth(roles: string[], handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) {
        return await authWithAuth(async (ctx: WithAuthContext<TUser>) => {
            checkRole(roles, ctx.user);
            return await handler(ctx);
        });
    }

    return {
        ...rest,
        auth,
        withAuth
    }
}