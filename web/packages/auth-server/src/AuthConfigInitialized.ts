import { UserBase } from './withAuth';
import { AuthConfig } from './AuthConfig';

export type AuthConfigInitialized<TUser extends UserBase> = Required<AuthConfig<TUser>>;
