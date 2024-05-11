import { Typography } from '@signalco/ui-primitives/Typography';

export default function LoginConfirmSuccessPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Login Successful</Typography>
            <Typography center className="text-balance">
                Return to the page you requested login from.
            </Typography>
            <Typography center className="text-balance" level="body1">
                You can close this windows.
            </Typography>
        </>
    );
}
