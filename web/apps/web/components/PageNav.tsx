import React from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../src/knownPages';
import SignalcoLogotype from './icons/SignalcoLogotype';

const navLinks = [
    { href: KnownPages.Features, text: 'Features' },
    { href: KnownPages.Channels, text: 'Channels' },
    { href: KnownPages.Pricing, text: 'Pricing' }
];

function NavMenu() {
    return (
        <nav className="grid grid-cols-3">
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
        </nav>
    );
}

export function PageNav({ fullWidth }: { fullWidth?: boolean | undefined; }) {
    return (
        <nav className={cx(
            'backdrop-blur-md py-4 fixed top-0 left-0 right-0 z-10 h-20',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="signalco">
                                <SignalcoLogotype height={42} />
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <NavMenu />
                            <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
