import { Stack } from '@mui/system';
import { Paper } from '@mui/material';
import { Button, Typography } from '@mui/joy';

export default function CtaSection() {
    return (
        <Paper variant="elevation" elevation={0}>
            <Stack alignItems="center" spacing={4} sx={{ py: 8 }}>
                <Typography level="h4" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <Button color="primary" variant="solid" size="lg" href="/app">Start now for free</Button>
                    <Typography level="body2" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
