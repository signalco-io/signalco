import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar, Box, Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
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
import GradientIcon from "./icons/GradientIcon";

const navItems = [
  { label: 'Dashboard', path: '/app', icon: DashboardSharpIcon, htmlColor: ['#42a5f5', '#283593'] },
  { label: 'Devices', path: '/app/devices', icon: DevicesOtherSharpIcon, htmlColor: ['#fff', '#ccc'] },
  { label: 'Processes', path: '/app/processes', icon: AccountTreeSharpIcon, htmlColor: ['#fff', '#ccc'] },
  { label: 'Beacons', path: '/app/beacons', icon: DeviceHubSharpIcon, htmlColor: ['#fff', '#ccc'] }
];

const NavProfile = () => {
  const { logout, user } = useAuth0();
  const router = useRouter();

  const NavLink = ({ path, icon, active }: { path: string, icon: SvgIconComponent, active: boolean }) => (
    <Link href={path} passHref>
      <IconButton disabled={active}>
        <GradientIcon icon={icon} gradient={!active ? ['#fff', '#ddd'] : undefined} />
      </IconButton>
    </Link>
  );

  const activeNavItem = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), ni => 0 - ni.path.length)[0];
  const userNameInitials = user.given_name && user.family_name ? `${user.given_name[0]}${user.family_name[0]}` : user.email[0];

  return (
    <>
      <Grid container direction="column" alignItems="center" sx={{ height: '100%', borderRight: '1px solid transparent', borderImageSlice: 1, borderImageSource: `linear-gradient(${activeNavItem.htmlColor[0]}, ${activeNavItem.htmlColor[1]})` }}>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container direction="column">
            {navItems.map((ni, index) => <NavLink key={index + 1} path={ni.path} icon={ni.icon} active={ni === activeNavItem} />)}
          </Grid>
        </Grid>
        <Grid item>
          <Box sx={{ width: '160px', transform: 'rotate(-90deg)', transformOrigin: 'top', position: 'absolute', left: '-68px', top: '50%' }}>
            <Grid container direction="row" justifyContent="center" spacing={1}>
              <Grid item>
                <GradientIcon fontSize="small" icon={activeNavItem.icon} gradient={activeNavItem.htmlColor} />
              </Grid>
              <Grid item>
                <Typography sx={{ textTransform: 'uppercase' }} variant="subtitle2" color="textSecondary">{activeNavItem.label}</Typography>
              </Grid>
            </Grid>
          </Box>
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
