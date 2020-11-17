import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import AppLayout from "../components/AppLayout";
import ApiExplorer from "../components/explorer/ApiExplorer";
import HomeOverview from "../components/home/HomeOverview";
import StorageListQueues from "../components/management/storage/StorageListQueues";
import StorageListTables from "../components/management/storage/StorageListTables";

const Dashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HomeOverview />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper>
            <Box sx={{ pt: 2, px: 2 }}>
              <Typography variant="h4">Storage Tables</Typography>
            </Box>
            <StorageListTables />
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper>
            <Box sx={{ pt: 2, px: 2 }}>
              <Typography variant="h4">Storage Queues</Typography>
            </Box>
            <StorageListQueues />
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper>
            <Box sx={{ pt: 2, px: 2 }}>
              <Typography variant="h4">API</Typography>
            </Box>
            <ApiExplorer />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.layout = AppLayout;

export default Dashboard;
