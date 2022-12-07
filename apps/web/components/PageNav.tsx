'use client';

import React, { Suspense } from 'react';
import { NavigatingButton, Container, Button, Box, Row, Link } from '@signalco/ui';
import SignalcoLogotype from './icons/SignalcoLogotype';

const navLinks = [
    // { href: '/features', text: 'Features' },
    { href: '/channels', text: 'Channels' },
    { href: '/pricing', text: 'Pricing' }
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
        <Box component="nav" sx={{
            borderBottom: '1px solid transparent',
            borderColor: 'background.body',
            py: 2,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: '80px',
            paddingLeft: fullWidth ? '24px' : 0,
            paddingRight: fullWidth ? '24px' : 0,
            backdropFilter: 'saturate(180%) blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="signalco">
                                <SignalcoLogotype height={42} />
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <Suspense>
                                <NavMenu />
                            </Suspense>
                            <NavigatingButton href="/app" prefetch={false}>App</NavigatingButton>
                        </Row>
                    </Row>
                </header>
            </Container>
        </Box>
    );
}
