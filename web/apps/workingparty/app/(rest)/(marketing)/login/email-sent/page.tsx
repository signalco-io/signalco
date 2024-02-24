import { Typography } from '@signalco/ui-primitives/Typography';

export default function LoginEmailSentPage() {
    const email = 'email@example.com';
    const verifyPhrase = 'Amazong Gift';

    return (
        <>
            <Typography center level="h2" semiBold>Email Login</Typography>
            <Typography center level="body1" secondary>
                Keep this window open, and in new tab or another device, open the link we just sent to{' '}
                <span className="inline font-semibold text-blue-500">{email}</span>{' '}
                with security code:
            </Typography>
            <Typography className="rounded border p-3 text-center font-bold">
                {verifyPhrase}
            </Typography>
        </>
    )
}
