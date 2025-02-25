import { cookies } from 'next/headers';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export async function clearCookie<TUser extends UserBase>(config: AuthConfigInitialized<TUser>['cookie']) {
    const cookieStore = await cookies();
    if (cookieStore.has(config.name)) {
        cookieStore.delete(config.name);
    }
}