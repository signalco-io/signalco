import Button from "@material-ui/core/Button";
import { useAuth } from "react-use-auth";
import { Grid, Avatar, Typography, IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const NavProfile = () => {
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated()) return null;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Avatar src={user.picture} />
      </Grid>
      <Grid item>
        <Typography>{user.name}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={logout} color="primary" title="Logout">
          <ExitToAppIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default NavProfile;
