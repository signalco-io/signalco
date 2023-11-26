'use client';

import { Link } from '@signalco/ui-primitives/Link';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { KnownPages } from '../src/knownPages';
import { UserButton } from './UserButton';

type NavLinkItem = {
    href: string,
    text: string
};

export const navLinks: NavLinkItem[] = [
    { href: '#explore', text: 'Explore' },
    // { href: KnownPages.Pricing, text: 'Pricing' }
];

export function NavMenu({ cta }: { cta?: boolean; }) {
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
