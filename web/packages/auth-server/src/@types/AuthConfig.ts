import { UserBase } from './UserBase';

export type AuthConfig<TUser extends UserBase> = {
    security?: {
        expiry?: number
    },
    jwt?: {
        namespace?: string,
        issuer?: string,
        audience?: string,
        jwtSecretFactory: () => Promise<Uint8Array> | Uint8Array,
        expiry?: number | string | Date
    },
    cookie?: {
        name?: string,
        expiry?: number
    },
    getUser: (userId: string) => Promise<TUser | null | undefined> | TUser | null | undefined
};

