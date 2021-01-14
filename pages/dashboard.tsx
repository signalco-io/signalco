import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import AppLayout from "../components/AppLayout";
import HomeOverview from "../components/home/HomeOverview";

const Dashboard = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <HomeOverview />
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.layout = AppLayout;

export default Dashboard;
