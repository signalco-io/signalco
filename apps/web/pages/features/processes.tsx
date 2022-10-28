import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import { PageLayout } from '../../components/layouts/PageLayout';

function FeatureProcessesPage() {
  return (
    <Stack spacing={4}>
      <Typography level="h1">Processes</Typography>
    </Stack>
  );
}

FeatureProcessesPage.layout = PageLayout;

export default FeatureProcessesPage;
