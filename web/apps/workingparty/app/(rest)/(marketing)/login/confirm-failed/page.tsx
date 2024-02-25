import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

export default function LoginConfirmPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Login Failed</Typography>
            <Stack spacing={1}>
                <Typography center className="text-balance">
                    It looks like you may have clicked on an invalid email verification link.
                </Typography>
                <Typography center className="text-balance" level="body1" secondary>
                    Please close this window and try authenticating again.
                </Typography>
            </Stack>
        </>
    );
}
