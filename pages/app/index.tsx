import { observer } from 'mobx-react-lite';
import React from 'react';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import Dashboards from '../../components/dashboards/Dashboards';

const Dashboard = () => {
  console.debug('Page Dashboard');

  return (
    <Dashboards />
  );
};

Dashboard.layout = AppLayoutWithAuth;

export default observer(Dashboard);
