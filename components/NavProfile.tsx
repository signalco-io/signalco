import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar, Avatar, Button, Grid,
  IconButton,
  Toolbar
} from "@material-ui/core";
import Link from 'next/link';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Skeleton from "@material-ui/lab/Skeleton";
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import AccountTreeSharpIcon from '@material-ui/icons/AccountTreeSharp';
import DevicesOtherSharpIcon from '@material-ui/icons/DevicesOtherSharp';
import DeviceHubSharpIcon from '@material-ui/icons/DeviceHubSharp';
import React from "react";

const NavProfile = () => {
  const { logout, user } = useAuth0();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Grid container direction="row" alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container>
              <Grid item>
                <Link href="/app" passHref>
                  <Button startIcon={<DashboardSharpIcon />} style={{ height: '100%', borderRadius: 0 }}>Dashboard</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/app/devices" passHref>
                  <Button startIcon={<DevicesOtherSharpIcon />} style={{ height: '100%', borderRadius: 0 }}>Devices</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/app/processes" passHref>
                  <Button startIcon={<AccountTreeSharpIcon />} style={{ height: '100%', borderRadius: 0 }}>Processes</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/app/beacons" passHref>
                  <Button startIcon={<DeviceHubSharpIcon />} style={{ height: '100%', borderRadius: 0 }}>Beacons</Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                {user.picture ? (
                  <Avatar imgProps={{ width: 40, height: 40 }} src={user.picture} alt="User profile image">
                    {user.given_name && user.family_name ? `${user.given_name[0]}${user.family_name[0]}` : user.email[0]}
                  </Avatar>
                ) : (
                    <Skeleton variant="circular">
                      <Avatar>{user.given_name && user.family_name ? `${user.given_name[0]}${user.family_name[0]}` : user.email[0]}</Avatar>
                    </Skeleton>
                  )}
              </Grid>
              <Grid item>
                <IconButton onClick={() => logout()} color="primary" title="Logout">
                  <ExitToAppIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavProfile;
