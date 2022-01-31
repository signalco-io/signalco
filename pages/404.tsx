import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PageLayout } from '../components/AppLayout';
import { AppContext } from './_app';

const Image404 = () => {
    const appContext = useContext(AppContext);
    const scale = 0.6;
    return (
        <Image
            src={appContext.theme === 'dark' ? '/images/404-dark.png' : '/images/404-light.png'}
            width={256 * scale}
            height={256 * scale}
            priority />
    );
}

const NotFound = () => (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
            <Stack direction="row" justifyContent="center" spacing={{ xs: 2, sm: 4, md: 8 }} alignItems="center">
                <Box display={{ xs: "none", sm: "inline-block" }}>
                    <Image404 />
                </Box>
                <Stack spacing={2} alignItems="start">
                    <Stack>
                        <Typography variant="h1" fontSize="4em">404</Typography>
                        <Typography variant="h2" component="p">Page not found</Typography>
                    </Stack>
                    <Typography sx={{ opacity: 0.6 }}>Can't find find what you're looking for...</Typography>
                    <Link href="/" passHref>
                        <Button variant="outlined">signalco home</Button>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    </Stack>
);

NotFound.layout = PageLayout;

export default NotFound;