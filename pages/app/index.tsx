import { observer } from "mobx-react-lite";
import React from "react";
import { AppLayoutWithAuth } from "../../components/AppLayout";
import HomeOverview from "../../components/home/HomeOverview";

const Dashboard = () => {
  return (
    <HomeOverview />
  );
};

Dashboard.layout = AppLayoutWithAuth;

export default observer(Dashboard);
