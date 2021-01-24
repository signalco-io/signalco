import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Alert, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import DevicesRepository, { SignalDeviceStatePublishDto } from "../src/devices/DevicesRepository";

const Layout = (props: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [devicesHub, setDevicesHub] = useState<HubConnection>();

  useEffect(() => {
    const setAccessTokenAsync = async (): Promise<void> => {
      try {
        const token = await getAccessTokenSilently();
        HttpService.token = token;
      } catch (err) {
        console.warn("Auth0 error.", err);
        setError(err.toString());
      }
      finally {
        setIsLoading(false);
      }
    };

    setAccessTokenAsync();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const createHubConnection = async () => {
      const hub = new HubConnectionBuilder()
        .withUrl(HttpService.getApiUrl('/signalr/devices'), {
          accessTokenFactory: () => {
            if (HttpService.token == null)
              throw Error("Token not present. Unable to authorize SignalR client.");
            return HttpService.token;
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
  }, [isLoading])

  if (isLoading) {
    return <>Logging in...</>;
  }
  if (error) {
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
