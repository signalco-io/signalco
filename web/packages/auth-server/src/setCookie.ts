import { cookies } from 'next/headers';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function setCookie<TUser extends UserBase>(
    config: AuthConfigInitialized<TUser>['cookie'],
    cookieValue: Promise<string> | string,
    expiry?: number
) {
    (await cookies()).set(
        config.name,
        await cookieValue,
        {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + (expiry ?? config.expiry)),
        });
}