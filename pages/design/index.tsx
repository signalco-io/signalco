import { Stack } from '@mui/system';
import { Card, Typography } from '@mui/joy';
import { PageLayout } from '../../components/layouts/PageLayout';
import SignalcoLogotype from '../../components/icons/SignalcoLogotype';
import SignalcoLogo from '../../components/icons/SignalcoLogo';

function DesignPage() {
    return (
        <Stack spacing={3}>
            <Typography gutterBottom level="h2">Logo and logomark</Typography>
            <Typography>A logo is a general and main term for a graphic representation and an identification symbol of a brand, company, product, or individual. In short, both logotypes and logomarks are subsets of logos and can generally be called logos.</Typography>
            <Typography>Signalco doesn&apos;t have logotype as defined by the book definition. Logo can be used in place where logotype would be used otherwise.</Typography>
            <Typography>The Signalco logomark can be used in places where there is not enough room to display the full logo, or in cases where only branch symbols of multiple brands are displayed.</Typography>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, bgcolor: 'black' }}>
                        <SignalcoLogotype width={220} theme="dark" hideBadge />
                    </Card>
                    <Typography level="body3">Light on dark logo</Typography>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, alignItems: 'center', bgcolor: 'white' }}>
                        <SignalcoLogotype width={220} theme="light" hideBadge />
                    </Card>
                    <Typography level="body3">Dark on light logomark</Typography>
                </Stack>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', textAlign: 'center', p: 8, bgcolor: 'black' }}>
                        <SignalcoLogo width={60} theme="dark" />
                    </Card>
                    <Typography level="body3">Light on dark logomark</Typography>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, alignItems: 'center', bgcolor: 'white' }}>
                        <SignalcoLogo width={60} theme="light" />
                    </Card>
                    <Typography level="body3">Dark on light logomark</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}

DesignPage.layout = PageLayout;

export default DesignPage;
