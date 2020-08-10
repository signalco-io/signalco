import { Typography, Box, Grid, Paper } from "@material-ui/core";
import AppLayout from "../components/AppLayout";
import StorageListTables from "../components/management/storage/StorageListTables";
import StorageListQueues from "../components/management/storage/StorageListQueues";
import ApiExplorer from "../components/explorer/ApiExplorer";

const Home = () => {
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper>
            <Box pt={2} px={2}>
              <Typography variant="h4">Storage Tables</Typography>
            </Box>
            <StorageListTables />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Box pt={2} px={2}>
              <Typography variant="h4">Storage Queues</Typography>
            </Box>
            <StorageListQueues />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Box pt={2} px={2}>
              <Typography variant="h4">API</Typography>
            </Box>
            <ApiExplorer />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

Home.layout = AppLayout;

export default Home;
