import React from 'react';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import Dashboards from '../../components/dashboards/Dashboards';

function Dashboard() {
  console.debug('Page Dashboard');

  return (
    <Dashboards />
  );
}

Dashboard.layout = AppLayoutWithAuth;
Dashboard.title = 'Home';

export default Dashboard;
