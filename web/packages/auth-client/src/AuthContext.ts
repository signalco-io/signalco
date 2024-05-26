import { createContext } from 'react';
import { AuthCurrentUserBase } from './useCurrentUser';

export type AuthContextValue<T extends AuthCurrentUserBase> = {
    currentUserFactory: () => Promise<T | null>;
    urls?: {
        signIn?: string;
        signOut?: string;
        signUp?: string;
    }
};

export const AuthContext = createContext<AuthContextValue<AuthCurrentUserBase>>({
    currentUserFactory: async () => null
});