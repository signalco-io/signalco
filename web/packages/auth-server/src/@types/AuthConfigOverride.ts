import type { UserBase } from './UserBase';
import type { AuthConfig } from './AuthConfig';

type DeepPartial<T> = {
    [K in keyof T]: T[K] extends Partial<T[K]> ? T[K] : DeepPartial<T[K]>
};

export type AuthConfigOverride<TUser extends UserBase> = DeepPartial<AuthConfig<TUser>>;