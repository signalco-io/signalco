import { Link } from '@signalco/ui-primitives/Link';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { KnownPages } from '../src/knownPages';
import { UserButton } from './auth/UserButton';
import { SignUpButton } from './auth/SignUpButton';
import { SignInButton } from './auth/SignInButton';
import { SignedOut } from './auth/SignedOut';
import { SignedIn } from './auth/SignedIn';

type NavLinkItem = {
    href: string,
    text: string
};

export const navLinks: NavLinkItem[] = [
    { href: '#explore', text: 'Explore' },
    // { href: KnownPages.Pricing, text: 'Pricing' }
];

export function NavMenu() {
    return (
        <>
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
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
        </>
    );
}
