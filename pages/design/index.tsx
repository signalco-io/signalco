import { Card, CardMedia, Stack, Typography } from '@mui/material';
import SignalcoLogo from '../../components/icons/SignalcoLogo';
import SignalcoLogotype from '../../components/icons/SignalcoLogotype';
import { PageLayout } from '../../components/layouts/PageLayout';

function DesignPage() {
    return (
        <Stack spacing={3}>
            <Typography gutterBottom variant="h2">Logo and logomark</Typography>
            <Typography>A logo is a general and main term for a graphic representation and an identification symbol of a brand, company, product, or individual. In short, both logotypes and logomarks are subsets of logos and can generally be called logos.</Typography>
            <Typography>Signalco doesn&apos;t have logotype as defined by the book definition. Logo can be used in place where logotype would be used otherwise.</Typography>
            <Typography>The Signalco logomark can be used in places where there is not enough room to display the full logo, or in cases where only branch symbols of multiple brands are displayed.</Typography>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, bgcolor: 'black' }}>
                        <CardMedia>
                            <SignalcoLogotype width={320} theme="dark" hideBadge />
                        </CardMedia>
                    </Card>
                    <Typography variant="caption">Light on dark logo</Typography>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, bgcolor: 'white' }}>
                        <CardMedia>
                            <SignalcoLogotype width={320} theme="light" hideBadge />
                        </CardMedia>
                    </Card>
                    <Typography variant="caption">Light on dark logo</Typography>
                </Stack>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', textAlign: 'center', p: 8, bgcolor: 'black' }}>
                        <CardMedia>
                            <SignalcoLogo width={100} theme="dark" />
                        </CardMedia>
                    </Card>
                    <Typography variant="caption">Dark on light logomark</Typography>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Card sx={{ textAlign: 'center', p: 8, bgcolor: 'white' }}>
                        <CardMedia>
                            <SignalcoLogo width={100} theme="light" />
                        </CardMedia>
                    </Card>
                    <Typography variant="caption">Light on dark logomark</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}

DesignPage.layout = PageLayout;

export default DesignPage;
