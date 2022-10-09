import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Stack, Box } from '@mui/system';
import { Button } from '@mui/joy';
import useIsMobile from 'src/hooks/useIsMobile';
import Container from './shared/layout/Container';
import NavigatingButton from './shared/buttons/NavigatingButton';
import SignalcoLogotype from './icons/SignalcoLogotype';

const navLinks = [
    // { href: '/features', text: 'Features' },
    { href: '/channels', text: 'Channels' },
    { href: '/pricing', text: 'Pricing' }
];

function NavMenu() {
    const isMobile = useIsMobile();

    if (isMobile) return null;

    return (
        <>
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href} passHref>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
        </>
    )
};

export function PageNav(props: { fullWidth?: boolean | undefined; }) {
    const router = useRouter();

    const handleButtonAuxClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        router.push('/design');
    };

    console.log('PageNav rendered');

    return (
        <Box component="nav" sx={{
            borderBottom: '1px solid transparent',
            borderColor: 'divider',
            py: 2,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: '75px',
            backdropFilter: 'saturate(180%) blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={props.fullWidth ? false : 'lg'}>
                <Stack component="header" direction="row" justifyContent="space-between" alignItems="center">
                    <Box onContextMenu={handleButtonAuxClick} onAuxClick={handleButtonAuxClick}>
                        <Link href="/" passHref>
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
