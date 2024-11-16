'use client';
import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Button } from '@signalco/ui-primitives/Button';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../src/knownPages';
import { useLoginConfirm } from '../../../../../src/hooks/useLoginConfirm';

export function LoginConfirmForm() {
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
            router.push(KnownPages.LoginConfirmSuccess);
        } catch (error) {
            console.error('Failed to verify email', error);
            router.push(KnownPages.LoginConfirmFailed);
        }
    };

    return (
        <>
            <Typography center level="h2" semiBold>Email Verification</Typography>
            <Typography center level="body1" secondary>
                To complete the login process, please click the button bellow:
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
