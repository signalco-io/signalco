import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import HttpService from "../src/services/HttpService";
import NavProfile from "./NavProfile";

const Layout = (props: { children: React.ReactNode }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setAccessTokenAsync = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      HttpService.token = token;
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
