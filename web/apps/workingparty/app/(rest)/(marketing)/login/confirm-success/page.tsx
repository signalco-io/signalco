import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

export default function LoginConfirmSuccessPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Login Successful</Typography>
            <Stack spacing={1}>
                <Typography center className="text-balance">
                    You should be automatically redirected to application on page you requested login.
                </Typography>
                <Typography center className="text-balance" level="body1" secondary>
                    You can now close this window.
                </Typography>
            </Stack>
        </>
    );
}
