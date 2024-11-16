import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { authCurrentUserQueryKeys } from '@signalco/auth-client';

export function useLoginConfirm(): UseMutationResult<void, Error, {
    email: string;
    verifyPhrase: string;
}, unknown> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ email, verifyPhrase }: { email: string; verifyPhrase: string; }) => {
            const resp = await fetch('/api/auth/login/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, token: verifyPhrase })
            });
            if (resp.status < 200 || resp.status > 299) {
                throw new Error('Failed to confirm login');
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authCurrentUserQueryKeys });
        }
    });
}
