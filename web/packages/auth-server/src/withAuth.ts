import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { AuthConfigInitialized } from './AuthConfigInitialized';

export type UserBase = {
    id: string;
    accountIds: string[];
};

export type WithAuthContext<TUser extends UserBase> = {
    userId: string;
    user: TUser;
    accountId: string;
};

export async function ensureAuthUserId<TUser extends UserBase>(authConfig: AuthConfigInitialized<TUser>) {
    const sessionCookie = cookies().get(authConfig.cookieName);
    if (!sessionCookie?.value)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await jwtVerify(sessionCookie.value, await authConfig.jwtSecretFactory(), {
        issuer: `urn:${authConfig.namespace}:issuer:${authConfig.issuer}`,
        audience: `urn:${authConfig.namespace}:audience:${authConfig.audience}`,
    });
    const userId = result.payload.sub;
    if (!userId || typeof userId !== 'string' || userId.length === 0)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // TODO: Extract claims and return them as well

    return {
        userId
    };
}

export async function withAuth<TUser extends UserBase>(config: AuthConfigInitialized<TUser>, handler: (ctx: WithAuthContext<TUser>) => Promise<Response>) {
    const userInfoOrResponse = await ensureAuthUserId(config);
    if (userInfoOrResponse instanceof Response)
        return userInfoOrResponse;
    const user = await config.getUser(userInfoOrResponse.userId);
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