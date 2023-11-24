import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import PageCenterHeader from '../../../../components/pages/PageCenterHeader';

export default function FeatureSpacesPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader header="Spaces" />
            <Typography level="h4">Widgets</Typography>
            <Stack spacing={2}>
                <Typography level="h5">Explore widgets</Typography>
            </Stack>
        </Stack>
    );
}
