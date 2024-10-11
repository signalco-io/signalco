import { cookies } from 'next/headers';
import type { UserBase } from './@types/UserBase';
import type { AuthConfigInitialized } from './@types/AuthConfigInitialized';

export function clearCookie<TUser extends UserBase>(config: AuthConfigInitialized<TUser>) {
    const cookieStore = cookies();
    if (cookieStore.has(config.cookie.name)) {
        cookieStore.delete(config.cookie.name);
    }
}