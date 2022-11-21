import { NavigatingButton, Stack, Sheet, Typography } from '@signalco/ui';

export default function CtaSection() {
    return (
        <Sheet sx={{ borderRadius: 'var(--joy-radius-lg)', py: 8 }}>
            <Stack alignItems="center" spacing={4}>
                <Typography level="h4" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <NavigatingButton href="/app" size="lg">Start now for free</NavigatingButton>
                    <Typography level="body2" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Sheet>
    );
}
