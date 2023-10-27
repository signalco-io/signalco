import React, { Suspense } from 'react';
import { cx } from 'classix';
import { Row } from '@signalco/ui/dist/Row';
import { Link } from '@signalco/ui/dist/Link';
import { Container } from '@signalco/ui/dist/Container';
import { Button } from '@signalco/ui/dist/Button';

type NavLinkItem = {
    href: string,
    text: string
};

const navLinks: NavLinkItem[] = [
    // { href: '/features', text: 'Features' },
    // { href: KnownPages.Pricing, text: 'Pricing' }
];

function NavMenu() {
    return (
        <>
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
        </>
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
                            <Link href="/">
                                DoProcess
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <Suspense>
                                <NavMenu />
                            </Suspense>
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
