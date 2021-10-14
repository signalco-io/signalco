import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Alert, Grid } from "@mui/material";
import React, { useEffect } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";
import { setSentryUser } from "../src/errors/SentryUtil";
import { useSnackbar } from 'notistack';
import PageNotificationService from "../src/notifications/PageNotificationService";
import RealtimeService from '../src/realtime/realtimeService';

const Layout = (props: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, error, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.debug("AppLayout rendering");

  // Set snackbar functions
  PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

  // Set Auth0 token factory
  if (typeof HttpService.tokenFactory === 'undefined' &&
    typeof getAccessTokenSilently !== 'undefined') {
    HttpService.tokenFactory = getAccessTokenSilently;
  }

  // Refirect to login if not authenticated
  useEffect(() => {
    if (isLoading) return;

    if (HttpService.isOnline && !isAuthenticated) {
      console.log("Login redirecting... Online: ", HttpService.isOnline)
      loginWithRedirect();
    }
  }, [loginWithRedirect, isLoading, isAuthenticated])

  // Set sentry user
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    setSentryUser(user.email);
  }, [isLoading, isAuthenticated, user]);

  // Initiate SignalR communication
  useEffect(() => {
    if (!isLoading) {
      RealtimeService.startAsync();
    }
  }, [isLoading]);

  // Show error if available
  if (error) {
    PageNotificationService.show(error.message, "error");
  }

  return (
    <Grid container direction="column" sx={{ height: '100%', width: '100%' }} wrap="nowrap">
      <Grid item>
        <NavProfile />
      </Grid>
      <Grid sx={{ height: '100%', flexGrow: 1, position: 'relative' }} item>
        {props.children}
      </Grid>
    </Grid>
  );
};

export default withAuthenticationRequired(Layout);
