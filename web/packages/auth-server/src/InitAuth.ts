import { UserBase, WithAuthContext, withAuth } from './withAuth';
import { AuthConfig } from './AuthConfig';

const defaultConfig = {
    namespace: 'app',
    issuer: 'api',
    audience: 'web',
    cookieName: 'auth_session',
    jwtSecretFactory: async () => { throw new Error('Not implemented'); },
    getUser: async () => { throw new Error('Not implemented'); }
};

export function InitAuth<TUser extends UserBase>(config: AuthConfig<TUser>): {
    withAuth: (handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) => Promise<Response>;
} {
    const initializedConfig = { ...defaultConfig, ...config };
    return {
        withAuth: (handler) => withAuth(initializedConfig, handler)
    };
}
