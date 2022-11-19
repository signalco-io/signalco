import { Stack } from '@signalco/ui';
import { Typography } from '@mui/joy';
import PageCenterHeader from 'components/pages/PageCenterHeader';
import WidgetStore from '../../components/widget-store/WidgetStore';
import { PageLayout } from '../../components/layouts/PageLayout';

function FeatureDashboardsPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader header="Dashboards" />
            <Typography level="h4">Widgets</Typography>
            <Stack spacing={2}>
                <Typography level="h5">Explore widgets</Typography>
                <WidgetStore />
            </Stack>
        </Stack>
    );
}

FeatureDashboardsPage.layout = PageLayout;

export default FeatureDashboardsPage;
