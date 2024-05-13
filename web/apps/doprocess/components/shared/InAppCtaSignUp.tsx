'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { ViewEmptyPlaceholder } from '../processes/processes/ViewEmptyPlaceholder';
import { SignUpButton } from '../auth/SignUpButton';
import { SignInButton } from '../auth/SignInButton';

export function InAppCtaSignUp() {
    return (
        <ViewEmptyPlaceholder className="rounded-lg border">
            <Typography level="h3">You are not signed in</Typography>
            <Typography tertiary>Please sign in or create an account to manage processes and documents.</Typography>
            <Row spacing={2}>
                <SignInButton />
                <SignUpButton>
                    Start for free
                </SignUpButton>
            </Row>
        </ViewEmptyPlaceholder>
    );
}
