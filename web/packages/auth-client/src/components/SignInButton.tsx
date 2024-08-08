import { Button } from '@signalco/ui-primitives/Button';

export function SignInButton() {
    return (
        <Button
            href={'/login'}
            variant="plain">
            Sign in
        </Button>
    );
}
