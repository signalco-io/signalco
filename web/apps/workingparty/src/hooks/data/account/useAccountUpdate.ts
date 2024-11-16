import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { Account } from './useAccount';


export function useAccountUpdate(accountId: string | undefined): UseMutationResult<void, Error, Pick<Account, 'name'>, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (newUserData: Pick<Account, 'name'>) => {
            const response = await fetch(`/api/accounts/${accountId}`, {
                method: 'PATCH',
                body: JSON.stringify(newUserData)
            });
            if (response.status < 200 || response.status > 299) {
                throw new Error('Failed to update account');
            }
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['accounts', accountId] });
        }
    });
}
