'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Button } from '@signalco/ui-primitives/Button';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../src/knownPages';

function useLoginConfirm() {
    return useMutation({
        mutationFn: async ({ email, verifyPhrase }: { email: string, verifyPhrase: string }) => {
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

export default function LoginConfirmPage() {
    const router = useRouter();
    const loginConfirm = useLoginConfirm();
    const [verifyPhrase] = useSearchParam('token');
    const [email] = useSearchParam('email');

    const handleVerify = async () => {
        if (!verifyPhrase || !email) {
            router.push(KnownPages.LoginConfirmFailed);
            return;
        }

        try {
            await loginConfirm.mutateAsync({ email, verifyPhrase });
            router.push(KnownPages.App);
        } catch (error) {
            console.error('Failed to verify email', error);
            router.push(KnownPages.LoginConfirmFailed);
        }
    }

    return (
        <>
            <Typography center level="h2" semiBold>Email Verification</Typography>
            <Typography center level="body1" secondary>
                To complete the login process, please click the button bellow;
            </Typography>
            <Button
                variant="solid"
                size="lg"
                className="text-lg"
                onClick={handleVerify}
                loading={loginConfirm.isPending}
                disabled={loginConfirm.isPending}>
                Verify
            </Button>
        </>
    );
}
