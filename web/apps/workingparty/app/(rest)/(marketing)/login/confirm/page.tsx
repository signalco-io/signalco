import { Typography } from '@signalco/ui-primitives/Typography';
import { Button } from '@signalco/ui-primitives/Button';

export default function LoginConfirmPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Email Verification</Typography>
            <Typography center level="body1" secondary>
                To complete the login process, please click the button bellow;
            </Typography>
            <Button variant="solid" size="lg" className="text-lg">
                Verify
            </Button>
        </>
    );
}
