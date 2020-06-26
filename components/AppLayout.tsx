import { Grid } from "@material-ui/core";
import NavProfile from "./NavProfile";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import HttpService from "../src/services/HttpService";

const Layout = (props: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setAccessTokenAsync = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      HttpService.token = token;
      console.log("Set token", token);
      setIsLoading(false);
    };

    setAccessTokenAsync();
  }, []);

  if (isLoading) {
    return <>Logging in...</>;
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
