import { Button, Stack, Typography } from '@mui/material';
import { PageLayout } from '../../components/layouts/PageLayout';

const SlackPage = () => (
    <Stack spacing={2}>
        <Typography variant="h1">Slack</Typography>
        <p>Signalco is on Slack</p>
        <Stack direction="row">
            <Button href="/app/channels/slack">View your channel</Button>
        </Stack>
    </Stack>
);

SlackPage.layout = PageLayout;

export default SlackPage;
