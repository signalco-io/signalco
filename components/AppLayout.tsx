import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Alert, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import DevicesRepository, { SignalDeviceStatePublishDto } from "../src/devices/DevicesRepository";
// import { useSnackbar } from 'notistack';
// import PageNotificationService from "../src/notifications/PageNotificationService";

const Layout = (props: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [pageError] = useState<string | undefined>();
  const [isPageLoading, setPageLoading] = useState<boolean>(true);
  const [devicesHub, setDevicesHub] = useState<HubConnection | undefined>();
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Set snackbar functions
  // PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

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

    setPageLoading(false);
  }, [loginWithRedirect, isLoading, isAuthenticated])

  // Initiate SignalR communication
  useEffect(() => {
    if (isPageLoading || isLoading) return;

    const createHubConnection = async () => {
      if (devicesHub != null) return;
      console.debug("Connecting to SignalR...");

      const hub = new HubConnectionBuilder()
        .withUrl(HttpService.getApiUrl('/signalr/devices'), {
          accessTokenFactory: async () => {
            if (typeof HttpService.tokenFactory === 'undefined')
              throw Error("TokenFactory not present. Unable to authorize SignalR client.");
            return await HttpService.tokenFactory();
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      try {
        await hub.start();
        hub.on("devicestate", async (state: SignalDeviceStatePublishDto) => {
          if (typeof state.DeviceId === 'undefined' ||
            typeof state.ChannelName === 'undefined' ||
            typeof state.ContactName === 'undefined' ||
            typeof state.TimeStamp === 'undefined') {
            console.warn("Got device state with invalid values", state);
            return;
          }

          const device = await DevicesRepository.getDeviceAsync(state.DeviceId);
          if (typeof device !== 'undefined') {
            device.updateState(
              state.ChannelName,
              state.ContactName,
              state.ValueSerialized,
              new Date(state.TimeStamp)
            );
          }
        });
      } catch (err) {
        console.log('Failed to start SignalR hub connection', err);
      }

      setDevicesHub(hub);
    }

    createHubConnection();
  }, [isLoading, devicesHub, isPageLoading])

  if (pageError) {
    return <Alert color="error" variant="filled">{error}</Alert>
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
