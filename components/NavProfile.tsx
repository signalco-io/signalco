import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar, Avatar, Grid,
  IconButton,
  Toolbar, Typography
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Skeleton from "@material-ui/lab/Skeleton";

const NavProfile = () => {
  const { logout, user } = useAuth0();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
          <Grid item>
            {user.picture ? (
              <Avatar src={user.picture} />
            ) : (
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
            )}
          </Grid>
          <Grid item>
            {user.name ? (
              <Typography>{user.name}</Typography>
            ) : (
              <Skeleton variant="text" width={120} />
            )}
          </Grid>
          <Grid item>
            <IconButton onClick={() => logout()} color="primary" title="Logout">
              <ExitToAppIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavProfile;
