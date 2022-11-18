'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import NavigatingButton from '@signalco/ui/dist/NavigatingButton';
import Container from '@signalco/ui/dist/Container';
import { Stack, Box } from '@mui/system';
import { Button } from '@mui/joy';
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
                <Link key={nl.href} href={nl.href} passHref legacyBehavior>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
        </>
    );
}

export function PageNav(props: { fullWidth?: boolean | undefined; }) {
    console.log('PageNav rendered');

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
            backdropFilter: 'saturate(180%) blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={props.fullWidth ? false : 'lg'}>
                <Stack component="header" direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Link href="/" passHref style={{ textDecoration: 'none' }}>
                            <SignalcoLogotype height={42} />
                        </Link>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <Suspense>
                            <NavMenu />
                        </Suspense>
                        <NavigatingButton href="/app" prefetch={false}>App</NavigatingButton>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
