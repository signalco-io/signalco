import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from './useCurrentUser';

export function useCurrentUserUpdate(): UseMutationResult<void, Error, Pick<User, 'displayName'>, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (newUserData: Pick<User, 'displayName'>) => {
            const response = await fetch('/api/users/current', {
                method: 'PATCH',
                body: JSON.stringify(newUserData)
            });
            if (response.status < 200 || response.status > 299) {
                throw new Error('Failed to update user');
            }
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['users', 'current'] });
        }
    });
}
