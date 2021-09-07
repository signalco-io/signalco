import { Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import AppLayout from "../../components/AppLayout";
import HomeOverview from "../../components/home/HomeOverview";

const Dashboard = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <HomeOverview />
      </Grid>
    </Grid>
  );
};

Dashboard.layout = AppLayout;

export default observer(Dashboard);
