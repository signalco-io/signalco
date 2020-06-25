import { Grid } from "@material-ui/core";
import NavProfile from "./NavProfile";
import { useAuth } from "react-use-auth";
import HttpService from "../src/services/HttpService";
import { useEffect } from "react";

const Layout = (props: { children: React.ReactNode }) => {
  const { isAuthenticated, authResult } = useAuth();

  if (HttpService.token == null && typeof window !== "undefined") {
    const tokenRaw = localStorage.getItem("auth:token");
    if (tokenRaw) {
      const token = JSON.parse(tokenRaw.toString());
      if (token != null) {
        HttpService.token = token;
      }
    }
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

export default Layout;
