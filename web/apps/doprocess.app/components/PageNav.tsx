import { Navigate } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/Row';
import { Link } from '@signalco/ui/Link';
import { cx } from '@signalco/ui/cx';
import { Container } from '@signalco/ui/Container';
import { Button } from '@signalco/ui/Button';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { KnownPages } from '../src/knownPages';
import { UserButton } from './UserButton';
import DoProcessLogo from './brand/DoProcessLogo';

type NavLinkItem = {
    href: string,
    text: string
};

const navLinks: NavLinkItem[] = [
    // { href: '/features', text: 'Features' },
    // { href: KnownPages.Pricing, text: 'Pricing' }
];

function NavMenu({ cta }: { cta?: boolean }) {
    return (
        <>
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
            <SignedOut>
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
            </SignedOut>
            <SignedIn>
                {cta && (
                    <Button
                        variant="solid"
                        href={KnownPages.Runs}
                        endDecorator={<Navigate />}>
                            Go to app
                    </Button>
                )}
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </>
    );
}

export function PageNav({ fullWidth, cta }: { fullWidth?: boolean, cta?: boolean }) {
    return (
        <nav className={cx(
            'backdrop-blur-md fixed top-0 left-0 right-0 z-10 h-16 border-b flex items-center',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div className="flex h-full flex-col items-center">
                            <Link href={KnownPages.Landing}>
                                <DoProcessLogo height={36} />
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <NavMenu cta={cta} />
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
