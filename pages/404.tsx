import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Stack, Typography } from '@mui/material';
import useUserTheme from 'src/hooks/useUserTheme';
import { PageLayout } from '../components/layouts/PageLayout';

function Image404() {
    const themeContext = useUserTheme();
    const scale = 0.6;
    return (
        <Image
            src={themeContext.isDark ? '/images/404-dark.png' : '/images/404-light.png'}
            width={256 * scale}
            height={256 * scale}
            alt="404 image"
            priority />
    );
}

function NotFound() {
  return <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
            <Stack direction="row" justifyContent="center" spacing={{ xs: 2, sm: 4, md: 8 }} alignItems="center">
                <Box display={{ xs: 'none', sm: 'inline-block' }}>
                    <Image404 />
                </Box>
                <Stack spacing={2} alignItems="start">
                    <Stack>
                        <Typography variant="h1" fontSize="4em">404</Typography>
                        <Typography variant="h2" component="p">Page not found</Typography>
                    </Stack>
                    <Typography sx={{ opacity: 0.6 }}>{'Can\'t find find what you\'re looking for...'}</Typography>
                    <Link href="/" passHref>
                        <Button variant="outlined">signalco home</Button>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    </Stack>
}

NotFound.layout = PageLayout;

export default NotFound;
