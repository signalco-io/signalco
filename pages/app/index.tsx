import { observer } from "mobx-react-lite";
import React from "react";
import { AppLayoutWithAuth } from "../../components/AppLayout";
import Dashboards from "../../components/dashboards/Dashboards";

const Dashboard = () => {
  return (
    <Dashboards />
  );
};

Dashboard.layout = AppLayoutWithAuth;

export default observer(Dashboard);
