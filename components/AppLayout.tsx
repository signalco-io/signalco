import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Fab, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";
import { useSnackbar } from 'notistack';
import PageNotificationService from "../src/notifications/PageNotificationService";
import RealtimeService from '../src/realtime/realtimeService';
import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import useHashParam from "../src/hooks/useHashParam";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const AppLayout = (props: { children?: React.ReactNode }) => {
  const {
    children
  } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');

  console.debug("AppLayout rendering");

  // Set snackbar functions
  PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

  // Initiate SignalR communication
  useEffect(() => {
    RealtimeService.startAsync();
  }, []);

  return (
    <>
      <Stack direction={isMobile ? 'column' : 'row'} sx={{ height: '100%', width: '100%' }}>
        {isFullScreen !== 'on' && <NavProfile />}
        <Box sx={{ height: '100%', width: '100%', flexGrow: 1, position: 'relative' }}>
          {children}
        </Box>
      </Stack>
      {isFullScreen && (
        <Fab
          size="small"
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
          sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
          onClick={() => setFullScreenHash(undefined)}>
          <FullscreenExitIcon fontSize="medium" />
        </Fab>
      )}
    </>
  );
};

const EmptyLayout = (props: { children?: React.ReactNode }) => {
  const {
    children
  } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.debug("EmptyLayout rendering");

  // Set snackbar functions
  PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {children}
    </Box>
  );
};

const Auth0Wrapper = (props: { children?: React.ReactNode }) => {
  const {
    children
  } = props;
  const router = useRouter();

  console.debug('Auth0Wrapper rendering');

  let redirectUri = 'https://www.signalco.io/login-return';
  if (typeof window !== "undefined" && window.location.origin.indexOf('localhost:3000') > 0) {
    redirectUri = `${window.location.origin}/login-return`;
  } else if (typeof window !== "undefined" && window.location.origin.indexOf('next.signalco.io') > 0) {
    redirectUri = `https://next.signalco.io/login-return`;
  }

  return (
    <Auth0Provider
      redirectUri={redirectUri}
      onRedirectCallback={(appState) => {
        // Use Next.js's Router.replace method to replace the url
        const returnTo = appState?.returnTo || "/";
        router.replace(returnTo);
      }}
      domain="dfnoise.eu.auth0.com"
      clientId="nl7QIQD7Kw3ZHt45qHHAZG0MEILSFa7U"
      audience="https://api.signalco.io"
    >
      {children}
    </Auth0Provider>
  );
};

const LayoutWithAuth = (props: { LayoutComponent: React.ComponentType, children?: React.ReactNode }) => {
  const {
    children,
    LayoutComponent
  } = props;
  const { error, isLoading, user, getAccessTokenSilently } = useAuth0();

  console.debug('LayoutWithAuth rendering');

  HttpService.tokenFactory = getAccessTokenSilently;

  // Set sentry user
  useEffect(() => {
    if (!user) {
      return;
    }

    // Set sentry user
    Sentry.configureScope(scope => {
      scope.setUser({ email: user.email });
    });
  }, [user]);

  // Show error if available
  if (!isLoading && error) {
    console.warn('Layout auth error', error);
  }

  return <LayoutComponent>{children}</LayoutComponent>;
};

export const AppLayoutWithAuth = (props: { children: React.ReactNode }) => (
  <Auth0Wrapper><LayoutWithAuth LayoutComponent={withAuthenticationRequired(AppLayout)}>{props.children}</LayoutWithAuth></Auth0Wrapper>
);

export const EmptyLayoutWithAuth = (props: { children: React.ReactNode }) => (
  <Auth0Wrapper><LayoutWithAuth LayoutComponent={EmptyLayout}>{props.children}</LayoutWithAuth></Auth0Wrapper>
);
