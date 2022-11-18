import { NavigatingButton } from '@signalco/ui';
import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import { PageLayout } from '../components/layouts/PageLayout';

function NotFound() {
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
            <Stack direction="row" alignItems="center" justifyContent="center">
                <Stack spacing={2} alignItems="start">
                    <Typography level="h1">Page not found</Typography>
                    <Typography>{'Can\'t find find what you\'re looking for...'}</Typography>
                    <NavigatingButton href="/">signalco home</NavigatingButton>
                </Stack>
            </Stack>
        </Stack>
    );
}

NotFound.layout = PageLayout;

export default NotFound;
