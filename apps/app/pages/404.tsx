import { NavigatingButton, Row, Typography, Stack } from '@signalco/ui';
import { AppLayout } from '../components/layouts/AppLayout';

function NotFound() {
    return (
        <Stack alignItems="center" justifyContent="center" style={{ minHeight: '50vh' }}>
            <Row justifyContent="center">
                <Stack spacing={2} alignItems="start">
                    <Typography level="h1">Page not found</Typography>
                    <Typography>{'Can\'t find find what you\'re looking for...'}</Typography>
                    <NavigatingButton href="/">signalco home</NavigatingButton>
                </Stack>
            </Row>
        </Stack>
    );
}

NotFound.layout = AppLayout;

export default NotFound;
