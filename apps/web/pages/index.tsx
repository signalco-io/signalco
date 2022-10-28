import React from 'react';
import LandingPageView from 'components/views/LandingView';
import { PageFullLayout } from '../components/layouts/PageFullLayout';

function Index() {
  return <LandingPageView />;
}

Index.layout = PageFullLayout;

export default Index;
