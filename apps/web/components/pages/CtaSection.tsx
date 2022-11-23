import { NavigatingButton, Stack, Card, Typography } from '@signalco/ui';

export default function CtaSection() {
    return (
        <Card sx={{ py: 8 }}>
            <Stack alignItems="center" spacing={4}>
                <Typography level="h4" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <NavigatingButton href="/app" size="lg">Start now for free</NavigatingButton>
                    <Typography level="body2" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
