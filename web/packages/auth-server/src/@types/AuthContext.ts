import { UserBase } from './UserBase';

export type AuthContext<TUser extends UserBase> = {
    userId: string;
    user: TUser;
    accountId: string;
};
