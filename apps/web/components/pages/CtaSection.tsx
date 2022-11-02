import { Stack } from '@mui/system';
import { Sheet, Typography } from '@mui/joy';
import NavigatingButton from 'components/shared/buttons/NavigatingButton';

export default function CtaSection() {
    return (
        <Sheet sx={{ borderRadius: 'var(--joy-radius-lg)' }}>
            <Stack alignItems="center" spacing={4} sx={{ py: 8 }}>
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
