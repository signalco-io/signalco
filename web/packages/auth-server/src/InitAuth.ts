import { WithAuthContext, withAuth } from './withAuth';

export function InitAuth({ }): {
    withAuth: <TUser>(handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) => Promise<Response>;
} {
    return {
        withAuth
    };
}
