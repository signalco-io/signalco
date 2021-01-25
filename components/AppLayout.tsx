import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Alert, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import DevicesRepository, { SignalDeviceStatePublishDto } from "../src/devices/DevicesRepository";

const Layout = (props: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [pageError, setPageError] = useState<string | undefined>();
  const [isPageLoading, setPageLoading] = useState<boolean>(true);
  const [devicesHub, setDevicesHub] = useState<HubConnection | undefined>();

  const setAccessTokenAsync = async (): Promise<void> => {
    try {
      HttpService.tokenFactory = getAccessTokenSilently;
    } catch (err) {
      console.warn("Auth0 error.", err);
      setPageError(err.toString());
    }
    finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      loginWithRedirect();
    }
    else {
      setAccessTokenAsync();
    }
  }, [isLoading, isAuthenticated])

  useEffect(() => {
    if (isPageLoading || isLoading) return;

    const createHubConnection = async () => {
      if (typeof devicesHub !== undefined) return;

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
            console.debug("SignalR - device state updated", device.id, device.identifier, device.alias, state.ChannelName, state.ContactName, state.ValueSerialized, state.TimeStamp);
            device.updateState(
              state.ChannelName,
              state.ContactName,
              state.ValueSerialized,
              new Date(state.TimeStamp)
            );
          }
        });
      } catch (err) {
        console.log(err)
      }

      setDevicesHub(hub);
    }

    createHubConnection();
  }, [isPageLoading])

  // if (isLoading) {
  //   return <>Logging in...</>;
  // }
  if (pageError) {
    return <Alert color="error" variant="filled">{error}</Alert>
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <NavProfile />
      </Grid>
      <Grid item>{props.children}</Grid>
    </Grid>
  );
};

export default withAuthenticationRequired(Layout);
