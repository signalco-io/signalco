import { Stack , Typography } from '@signalco/ui';
import WidgetStore from '../../components/widget-store/WidgetStore';
import PageCenterHeader from '../../components/pages/PageCenterHeader';
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
