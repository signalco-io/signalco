import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import WidgetStore from '../../components/widget-store/WidgetStore';
import { PageLayout } from '../../components/layouts/PageLayout';

function FeatureDashboardsPage() {
    return (
        <Stack spacing={4}>
            <Typography level="h1">Dashboards</Typography>
            <Typography level="h2">Widgets</Typography>
            <Stack spacing={2}>
                <Typography level="h3">Explore widgets</Typography>
                <WidgetStore />
            </Stack>
        </Stack>
    );
}

FeatureDashboardsPage.layout = PageLayout;

export default FeatureDashboardsPage;
