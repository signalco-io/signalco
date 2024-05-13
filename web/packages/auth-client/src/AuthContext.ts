import { createContext } from 'react';
import { AuthCurrentUserBase } from './useCurrentUser';

export type AuthContextValue<T extends AuthCurrentUserBase> = {
    currentUserFactory: () => Promise<T | null>;
};

export const AuthContext = createContext<AuthContextValue<AuthCurrentUserBase>>({
    currentUserFactory: async () => null
});