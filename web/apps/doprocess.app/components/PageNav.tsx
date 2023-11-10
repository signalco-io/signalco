import { cx } from 'classix';
import { Navigate } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/dist/Row';
import { Link } from '@signalco/ui/dist/Link';
import { Container } from '@signalco/ui/dist/Container';
import { Button } from '@signalco/ui/dist/Button';
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { KnownPages } from '../src/knownPages';
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
                <SignInButton redirectUrl={KnownPages.Processes} mode="modal">
                    <Button variant="plain" size="lg">Sign in</Button>
                </SignInButton>
                <SignUpButton redirectUrl={KnownPages.Processes} mode="modal">
                    <Button
                        variant="solid"
                        size="lg"
                        endDecorator={<Navigate />}>
                            Start for free
                    </Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                {cta && (
                    <Button
                        variant="solid"
                        size="lg"
                        href={KnownPages.Processes}
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
            'backdrop-blur-md py-4 fixed top-0 left-0 right-0 z-10 h-16 border-b',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div className="flex h-full flex-col items-center">
                            <Link href="/">
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
