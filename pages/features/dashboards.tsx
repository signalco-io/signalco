import { Container, Stack, Typography } from "@mui/material";
import WidgetStore from "../../components/widgets/WidgetStore";

const FeatureDashboardsPage = () => (
    <Container>
        <Stack spacing={4}>
            <Typography variant="h1">Dashboards</Typography>
            <Typography variant="h2">Widgets</Typography>
            <Stack spacing={2}>
                <Typography variant="h3">Explore widgets</Typography>
                <WidgetStore />
            </Stack>
        </Stack>
    </Container>
);

export default FeatureDashboardsPage;