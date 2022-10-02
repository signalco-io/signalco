import { Button, Paper, Stack, Typography } from '@mui/material';

export default function CtaSection() {
    return (
        <Paper variant="elevation" elevation={0}>
            <Stack alignItems="center" spacing={4} sx={{ py: 8 }}>
                <Typography variant="h2" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <Button variant="contained" size="large" href="/app">Start now for free</Button>
                    <Typography color="textSecondary" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
