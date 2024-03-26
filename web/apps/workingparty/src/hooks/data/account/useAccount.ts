import { UseQueryResult, useQuery } from '@tanstack/react-query';

export type Account = {
    id: string;
    name: string;
    createdAt: number;
};

export function useAccount(accountId: string | undefined): UseQueryResult<Account, Error> {
    return useQuery({
        queryKey: ['accounts', accountId],
        queryFn: async () => {
            const response = await fetch(`/api/accounts/${accountId}`);
            if (response.status < 200 || response.status > 299) {
                return {
                    isLoggedIn: true
                };
            }

            const userData = await response.json() as Account;
            return {
                id: userData.id,
                name: userData.name,
                createdAt: userData.createdAt
            };
        },
        enabled: Boolean(accountId)
    });
}


