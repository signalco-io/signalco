import { Stack, Typography } from "@mui/material";
import { PageLayout } from "../../components/layouts/PageLayout";
import WidgetStore from "../../components/widgets/WidgetStore";

const FeatureDashboardsPage = () => (
    <Stack spacing={4}>
        <Typography variant="h1">Dashboards</Typography>
        <Typography variant="h2">Widgets</Typography>
        <Stack spacing={2}>
            <Typography variant="h3">Explore widgets</Typography>
            <WidgetStore />
        </Stack>
    </Stack>
);

FeatureDashboardsPage.layout = PageLayout;

export default FeatureDashboardsPage;