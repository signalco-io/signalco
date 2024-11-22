import type { UserBase } from './UserBase';

export type RbacUserBase = UserBase & {
    role: string;
}