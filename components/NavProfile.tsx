import Button from "@material-ui/core/Button";
import { useAuth } from "react-use-auth";
import {
  Grid,
  Avatar,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Skeleton from "@material-ui/lab/Skeleton";

const NavProfile = () => {
  const { logout, user } = useAuth();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Grid container spacing={1} alignItems="center" justify="flex-end">
          <Grid item>
            {user.picture ? (
              <Avatar src={user.picture} />
            ) : (
              <Skeleton variant="circle">
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
            <IconButton onClick={logout} color="primary" title="Logout">
              <ExitToAppIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavProfile;
