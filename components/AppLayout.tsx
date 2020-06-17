import { Grid } from "@material-ui/core";
import NavProfile from "./NavProfile";
import { useAuth } from "react-use-auth";
import HttpService from "../src/services/HttpService";
import { useEffect } from "react";

const Layout = (props: { children: React.ReactNode }) => {
  const { isAuthenticated, authResult } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("auth:token");
    if (HttpService.token == null && token != null) {
      HttpService.token = token;
      console.log("Layout Token", token);
    }
  }, []);

  return (
    <Grid container direction="column">
      <Grid item>
        <NavProfile />
      </Grid>
      <Grid item>{props.children}</Grid>
    </Grid>
  );
};

export default Layout;
