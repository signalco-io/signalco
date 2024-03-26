import { UseMutationResult, useMutation } from '@tanstack/react-query';

export function useLoginConfirm(): UseMutationResult<void, Error, {
    email: string;
    verifyPhrase: string;
}, unknown> {
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
        }
    });
}
