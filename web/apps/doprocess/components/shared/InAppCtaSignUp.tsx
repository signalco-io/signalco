'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { ViewEmptyPlaceholder } from '../processes/processes/ViewEmptyPlaceholder';
import { KnownPages } from '../../src/knownPages';

export function InAppCtaSignUp() {
    return (
        <ViewEmptyPlaceholder className="rounded-lg border">
            <Typography level="h3">You are not signed in</Typography>
            <Typography tertiary>Please sign in or create an account to manage processes and documents.</Typography>
            <Row spacing={2}>
                <SignInButton
                    redirectUrl={KnownPages.Runs}
                    mode="modal">
                    <Button variant="plain">Sign in</Button>
                </SignInButton>
                <SignUpButton
                    redirectUrl={KnownPages.Processes}
                    mode="modal">
                    <Button
                        variant="solid"
                        endDecorator={<Navigate />}>
                        Start for free
                    </Button>
                </SignUpButton>
            </Row>
        </ViewEmptyPlaceholder>
    );
}
