import React from 'react';
import Typography from '@signalco/ui/dist/Typography';
import Stack from '@signalco/ui/dist/Stack';
import Row from '@signalco/ui/dist/Row';

export default function LandingPageView() {
    return (
        <Row spacing={4} alignItems="start">
            <Stack spacing={1}>
                <Typography level="h6">Levels</Typography>
                <Stack>
                    <Typography level="h1">H1</Typography>
                    <Typography level="h2">H2</Typography>
                    <Typography level="h3">H3</Typography>
                    <Typography level="h4">H4</Typography>
                    <Typography level="h5">H5</Typography>
                    <Typography level="h6">H6</Typography>
                    <Typography>Default</Typography>
                    <Typography level="body1">Body1</Typography>
                    <Typography level="body2">Body2</Typography>
                    <Typography level="body3">Body3</Typography>
                </Stack>
            </Stack>
            <Stack spacing={1}>
                <Typography level="h6">Color and weight</Typography>
                <Stack>
                    <Typography>default</Typography>
                    <Typography secondary>secondary</Typography>
                    <Typography tertiary>tertiary</Typography>
                    <Typography extraThin>extraThin</Typography>
                    <Typography thin>thin</Typography>
                    <Typography semiBold>semiBold</Typography>
                    <Typography bold>bold</Typography>
                </Stack>
            </Stack>
        </Row>
    );
}
