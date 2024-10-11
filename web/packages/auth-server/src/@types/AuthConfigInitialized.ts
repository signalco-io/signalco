import { UserBase } from './UserBase';
import { AuthConfig } from './AuthConfig';

type DeepRequired<T> = Required<{
    [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>
}>

export type AuthConfigInitialized<TUser extends UserBase> = DeepRequired<AuthConfig<TUser>>;
