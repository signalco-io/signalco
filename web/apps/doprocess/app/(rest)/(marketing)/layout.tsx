import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { PageNav } from '@signalco/ui/Nav';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@signalco/auth-client/components';
import { KnownPages } from '../../../src/knownPages';
import DoProcessLogo from '../../../components/brand/DoProcessLogo';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav logo={<DoProcessLogo height={52} />}>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>Start for free</SignUpButton>
                </SignedOut>
                <SignedIn>
                    <Button
                        variant="solid"
                        href={KnownPages.Runs}
                        endDecorator={<Navigate />}>
                        App
                    </Button>
                    <UserButton />
                </SignedIn>
            </PageNav>
            <Container className="pt-20">
                {children}
            </Container>
        </>
    );
}
