import { useContext } from 'react';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';

export type AuthCurrentUserBase = {
    id: string;
}

type AuthCurrentUser<T extends AuthCurrentUserBase> = {
    isLogginedIn: boolean;
    userId?: string;
    user?: T;
}

export const authCurrentUserQueryKeys = ['users', 'current'];

export function useCurrentUser<T extends AuthCurrentUserBase>(): UseQueryResult<AuthCurrentUser<T>, Error> {
    const currentUserFactory = useContext(AuthContext).currentUserFactory;
    return useQuery({
        queryKey: authCurrentUserQueryKeys,
        queryFn: async () => {
            const user = await currentUserFactory();
            return {
                isLogginedIn: !!user,
                userId: user?.id,
                user
            };
        }
    });
}
