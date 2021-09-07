import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar, Box, ButtonBase, Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from 'next/link';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Skeleton from '@mui/material/Skeleton';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import AccountTreeSharpIcon from '@mui/icons-material/AccountTreeSharp';
import DevicesOtherSharpIcon from '@mui/icons-material/DevicesOtherSharp';
import DeviceHubSharpIcon from '@mui/icons-material/DeviceHubSharp';
import React from "react";
import { useRouter } from "next/router";
import { orderBy } from "../src/helpers/ArrayHelpers";
import { SvgIconComponent } from "@mui/icons-material";
import { User } from '@auth0/auth0-spa-js';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { useTheme } from "@mui/material";

const navItems = [
  { label: 'Dashboard', path: '/app', icon: DashboardSharpIcon },
  { label: 'Devices', path: '/app/devices', icon: DevicesOtherSharpIcon },
  { label: 'Processes', path: '/app/processes', icon: AccountTreeSharpIcon },
  { label: 'Beacons', path: '/app/beacons', icon: DeviceHubSharpIcon }
];

const UserAvatar = ({ user }: { user: User | undefined }) => {
  if (user === undefined) {
    return (<Avatar variant="circular" />);
  }

  let userNameInitials = "";
  if (user.given_name && user.family_name) {
    userNameInitials = `${user.given_name[0]}${user.family_name[0]}`;
  }
  if (userNameInitials === '' && user.email) {
    userNameInitials = user.email[0];
  }

  if (user.picture) {
    return (<Avatar imgProps={{ width: 40, height: 40 }} src={user.picture} alt="User profile image">
      {userNameInitials}
    </Avatar>);
  }

  return (
    <Skeleton variant="circular">
      <Avatar>{userNameInitials}</Avatar>
    </Skeleton>
  );
};

const NavProfile = () => {
  const { logout, user } = useAuth0();
  const theme = useTheme();
  const router = useRouter();
  const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' })

  const NavLink = ({ path, Icon, active, label }: { path: string, Icon: SvgIconComponent, active: boolean, label: string }) => (
    <Box borderBottom={active ? (theme.palette.mode === 'dark' ? "3px solid white" : "3px solid black") : undefined}>
      <Link href={path} passHref>
        <IconButton
          sx={{ opacity: theme.palette.mode === 'dark' ? (active ? 0.6 : 1) : (active ? 1 : 0.6) }}
          aria-label={label}
          title={label}
          size="large">
          <Icon />
        </IconButton>
      </Link>
    </Box>
  );

  const activeNavItem = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), ni => 0 - ni.path.length)[0];

  return (
    <>
      <Grid container alignItems="center" sx={{ width: '100%' }}>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container>
            {navItems.map((ni, index) =>
              <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={ni.label} />)}
          </Grid>
        </Grid>
        <Grid item>
          <ButtonBase {...bindTrigger(popupState)}>
            <UserAvatar user={user} />
          </ButtonBase>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => logout()}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </>
  );
};

export default NavProfile;
