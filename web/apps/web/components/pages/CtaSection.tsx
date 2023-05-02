import { NavigatingButton, Card } from '@signalco/ui';
import { Stack } from '@signalco/ui/dist/Stack';
import { Typography } from '@signalco/ui/dist/Typography';
import { KnownPages } from '../../src/knownPages';

export default function CtaSection() {
    return (
        <Card sx={{ py: 8 }}>
            <Stack alignItems="center" spacing={4}>
                <Typography level="h4" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <NavigatingButton href={KnownPages.App} size="lg">Start now for free</NavigatingButton>
                    <Typography level="body2" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
