import { Grid } from "@material-ui/core";
import NavProfile from "./NavProfile";

const Layout = (props: { children: React.ReactNode }) => (
  <Grid container direction="column">
    <Grid item>
      <NavProfile />
    </Grid>
    <Grid item>{props.children}</Grid>
  </Grid>
);

export default Layout;
