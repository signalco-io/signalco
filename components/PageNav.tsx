import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Button, ButtonBase, Container, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import useIsMobile from 'src/hooks/useIsMobile';
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
                    <Button variant="text" size="large" sx={{ fontWeight: 'bold' }}>{nl.text}</Button>
                </Link>
            ))}
        </>
    )
};

export function PageNav(props: { fullWidth?: boolean | undefined; }) {
    const router = useRouter();

    const handleButtonAuxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/design');
    };

    console.log('PageNav rendered');

    return (
        <Box component="nav" sx={{
            borderBottom: '1px solid transparent',
            borderColor: 'divider',
            transition: 'borderColor 0.2s, filter 0.5s',
            py: 2,
            position: 'sticky',
            top: 0,
            height: '75px',
            backdropFilter: 'saturate(180%) blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={props.fullWidth ? false : 'lg'}>
                <Stack component="header" direction="row" justifyContent="space-between" alignItems="center">
                    <Link href="/" passHref>
                        <ButtonBase disableRipple onContextMenu={handleButtonAuxClick} onAuxClick={handleButtonAuxClick}>
                            <SignalcoLogotype height={42} />
                        </ButtonBase>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <Suspense>
                            <NavMenu />
                        </Suspense>
                        <Link href="/app" prefetch={false} passHref>
                            <Button variant="contained" endIcon={<KeyboardArrowRightIcon fontSize="small" />}>App</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
