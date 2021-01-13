import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import AppLayout from "../components/AppLayout";
import HomeOverview from "../components/home/HomeOverview";

const Dashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HomeOverview />
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.layout = AppLayout;

export default Dashboard;
