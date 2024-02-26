import { UseQueryResult, useQuery } from '@tanstack/react-query';

type AuthCurrentUser = {
    isLogginedIn: boolean;
    userId?: string;
    user?: User;
}

type User = {
    id: string;
    displayName: string;
    email: string;
    createdAt: number;
    accountIds: Array<string>;
};

export function useCurrentUser(): UseQueryResult<AuthCurrentUser, Error> {
    return useQuery({
        queryKey: ['users', 'current'],
        queryFn: async () => {
            const response = await fetch('/api/users/current');
            if (response.status < 200 || response.status > 299) {
                return {
                    isLoggedIn: true
                };
            }

            const userData = await response.json() as User;
            return {
                isLogginedIn: true,
                userId: userData.id,
                user: userData
            };
        }
    });
}