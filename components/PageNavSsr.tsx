import { Box, Button, ButtonBase, Container, Stack } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SignalcoLogotype from './icons/SignalcoLogotype';

export function PageNavSsr(props: { fullWidth?: boolean | undefined; isScrolled?: boolean; }) {
    const router = useRouter();

    const handleButtonAuxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/design');
    };

    return (
        <Box component="nav" sx={{
            borderBottom: '1px solid transparent',
            borderColor: props.isScrolled ? 'divider' : 'transparent',
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
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Link href="/app" prefetch={false} passHref>
                            <Button variant="contained" endIcon={<KeyboardArrowRightIcon fontSize="small" />}>App</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
