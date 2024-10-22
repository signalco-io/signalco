import { ensureAuthUserId } from './ensureAuthUserId';
import type { UserBase } from './@types/UserBase';
import { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function auth<TUser extends UserBase>(config: AuthConfigInitialized<TUser>) {
    const userInfo = await ensureAuthUserId(config);

    const user = await config.getUser(userInfo.userId);
    if (!user) {
        throw new Error('User not found');
    }

    // TODO: Extract active account from cookie/jwt claim
    const accountId = user.accountIds[0];
    if (!accountId) {
        throw new Error('Account not found');
    }

    return {
        userId: userInfo.userId,
        user,
        accountId
    };
}