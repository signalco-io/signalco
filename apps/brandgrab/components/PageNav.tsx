'use client';

import React, { Suspense } from 'react';
import { NavigatingButton, Container, Button, Row, Link } from '@signalco/ui';
import { KnownPages } from '../src/knownPages';

const navLinks = [
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
        <nav style={{
            borderBottom: '1px solid var(--joy-palette-background-body)',
            paddingTop: 16,
            paddingBottom: 16,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: '80px',
            paddingLeft: fullWidth ? '24px' : 0,
            paddingRight: fullWidth ? '24px' : 0,
            backdropFilter: 'blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="BrandGrab.io">
                                BrandGrab.io
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
