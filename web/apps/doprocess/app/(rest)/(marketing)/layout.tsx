import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { PageNav, PageNavMenu } from '@signalco/ui/Nav';
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs';
import { KnownPages } from '../../../src/knownPages';
import DoProcessLogo from '../../../components/brand/DoProcessLogo';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth logo={<DoProcessLogo />}>
                <PageNavMenu>
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
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </PageNavMenu>
            </PageNav>
            <Container className="pt-20">
                {children}
            </Container>
        </>
    );
}
