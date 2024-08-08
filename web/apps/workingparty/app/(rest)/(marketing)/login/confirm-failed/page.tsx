import { Typography } from '@signalco/ui-primitives/Typography';

export default function LoginConfirmFailedPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Login Failed</Typography>
            <Typography center className="text-balance">
                It looks like you may have clicked on an invalid email verification link.
            </Typography>
            <Typography center className="text-balance" level="body1" secondary>
                Please close this window and try authenticating again.
            </Typography>
        </>
    );
}
