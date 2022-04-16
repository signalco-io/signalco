import { Card, CardMedia, Paper, Stack, Typography } from "@mui/material";
import SignalcoLogo from "../../components/icons/SignalcoLogo";
import { PageLayout } from "../../components/layouts/PageLayout";

const DesignPage = () => {
    return (
        <Stack spacing={2}>
            <Typography variant="h1">Design</Typography>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Card sx={{ width: '100%', textAlign: 'center', p: 8, bgcolor: 'black' }}>
                    <CardMedia>
                        <SignalcoLogo width={100} theme='dark' />
                    </CardMedia>
                </Card>
                <Card sx={{ width: '100%', textAlign: 'center', p: 8, bgcolor: 'white' }}>
                    <CardMedia>
                        <SignalcoLogo width={100} theme='light' />
                    </CardMedia>
                </Card>
            </Stack>
        </Stack>
    );
}

DesignPage.layout = PageLayout;

export default DesignPage;
