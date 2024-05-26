import { UserBase } from './withAuth';

export type AuthConfig<TUser extends UserBase> = {
    namespace?: string;
    issuer?: string;
    audience?: string;
    cookieName?: string;
    jwtSecretFactory: () => Promise<Uint8Array>;
    getUser: (userId: string) => Promise<TUser | null | undefined>
};

