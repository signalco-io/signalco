import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar, Box, Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Link from 'next/link';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Skeleton from "@material-ui/lab/Skeleton";
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import AccountTreeSharpIcon from '@material-ui/icons/AccountTreeSharp';
import DevicesOtherSharpIcon from '@material-ui/icons/DevicesOtherSharp';
import DeviceHubSharpIcon from '@material-ui/icons/DeviceHubSharp';
import React from "react";
import { useRouter } from "next/router";
import { orderBy } from "../src/helpers/ArrayHelpers";
import { SvgIconComponent } from "@material-ui/icons";

const navItems = [
  { label: 'Dashboard', path: '/app', icon: DashboardSharpIcon },
  { label: 'Devices', path: '/app/devices', icon: DevicesOtherSharpIcon },
  { label: 'Processes', path: '/app/processes', icon: AccountTreeSharpIcon },
  { label: 'Beacons', path: '/app/beacons', icon: DeviceHubSharpIcon }
];

const NavProfile = () => {
  const { logout, user } = useAuth0();
  const router = useRouter();

  const NavLink = ({ path, Icon, active, label }: { path: string, Icon: SvgIconComponent, active: boolean, label: string }) => (
    <Box borderBottom={active ? "3px solid white" : undefined}>
      <Link href={path} passHref>
        <IconButton disabled={active} aria-label={label} title={label}>
          <Icon />
        </IconButton>
      </Link>
    </Box>
  );

  const activeNavItem = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), ni => 0 - ni.path.length)[0];
  const userNameInitials = user.given_name && user.family_name ? `${user.given_name[0]}${user.family_name[0]}` : user.email[0];

  return (
    <>
      <Grid container alignItems="center" sx={{ width: '100%', borderBottom: '1px solid gray' }}>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container>
            {navItems.map((ni, index) =>
              <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={ni.label} />)}
          </Grid>
        </Grid>
        <Grid item>
          {user.picture ? (
            <Avatar imgProps={{ width: 40, height: 40 }} src={user.picture} alt="User profile image">
              {userNameInitials}
            </Avatar>
          ) : (
            <Skeleton variant="circular">
              <Avatar>{userNameInitials}</Avatar>
            </Skeleton>
          )}
          <Menu open={false}>
            <MenuItem>
              <IconButton onClick={() => logout()} color="primary" title="Logout">
                <ExitToAppIcon />
              </IconButton>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </>
  );
};

export default NavProfile;
