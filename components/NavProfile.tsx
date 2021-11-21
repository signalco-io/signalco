import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from 'next/link';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Skeleton from '@mui/material/Skeleton';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import AccountTreeSharpIcon from '@mui/icons-material/AccountTreeSharp';
import DevicesOtherSharpIcon from '@mui/icons-material/DevicesOtherSharp';
import DeviceHubSharpIcon from '@mui/icons-material/DeviceHubSharp';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { orderBy } from "../src/helpers/ArrayHelpers";
import { Settings as SettingsIcon, SvgIconComponent } from "@mui/icons-material";
import { User } from '@auth0/auth0-spa-js';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { label: 'Dashboard', path: '/app', icon: DashboardSharpIcon },
  { label: 'Entities', path: '/app/entities', icon: DevicesOtherSharpIcon },
  { label: 'Processes', path: '/app/processes', icon: AccountTreeSharpIcon },
  { label: 'Stations', path: '/app/stations', icon: DeviceHubSharpIcon }
];

const UserAvatar = ({ user }: { user?: User }) => {
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

  const size = { mobile: '36px', tablet: '42px', desktop: '58px' };

  if (user.picture) {
    return (<Avatar sx={{ width: size, height: size }} src={user.picture} alt="User profile image">
      {userNameInitials}
    </Avatar>);
  }

  return (
    <Skeleton variant="circular">
      <Avatar sx={{ width: size, height: size }}>{userNameInitials}</Avatar>
    </Skeleton>
  );
};

const UserProfileAvatar = () => {
  const { logout, user } = useAuth0();
  const router = useRouter();
  const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' });
  const navWidth = useNavWidth();
  const maxWidth = navWidth - 16;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <>
      <ButtonBase {...bindTrigger(popupState)} sx={{ width: { mobile: undefined, tablet: '100%' }, py: 1 }}>
        <Stack alignItems="center" spacing={2}>
          <UserAvatar user={user} />
          {!isMobile &&
            <Typography variant="h3" fontWeight={600} sx={{ maxWidth: `${maxWidth}px` }}>{user?.name}</Typography>
          }
        </Stack>
      </ButtonBase>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={() => { router.push('/app/settings'); popupState.close(); }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export const useNavWidth = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'));
  const isLaptopOrTablet = useMediaQuery(theme.breakpoints.between('tablet', 'desktop'));

  if (isMobile)
    return 0;
  return isLaptopOrTablet ? 109 : 228;
};

const NavLink = ({ path, Icon, active, label }: { path: string, Icon: SvgIconComponent, active: boolean, label: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'));
  const isNotDesktop = useMediaQuery(theme.breakpoints.down('desktop'));

  return (
    <Link href={path} passHref>
      <Button
        sx={{
          textTransform: "none",
          py: isMobile ? 2 : 3,
          px: 2
        }}
        aria-label={label}
        title={label}
        size="large">
        <Stack direction="row" sx={{ width: isNotDesktop ? '100%' : '128px' }} alignItems="center" spacing={isMobile ? 1 : 0}>
          <Icon sx={{ opacity: active ? 1 : 0.6, mr: { mobile: 0, desktop: 2 }, fontSize: { mobile: '26px', desktop: '17px' } }} />
          {(isMobile || !isNotDesktop) &&
            <Typography variant="h3" fontWeight={500} sx={{ opacity: active ? 1 : 0.6, }}>{label}</Typography>
          }
        </Stack>
      </Button>
    </Link>
  );
};

const NavProfile = () => {
  const router = useRouter();
  const activeNavItem = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), ni => 0 - ni.path.length)[0];
  const navWidth = useNavWidth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  return (
    <Stack
      direction={isMobile ? 'row' : 'column'}
      spacing={isMobile ? 0 : 4}
      sx={{ px: { mobile: 2, tablet: 0 }, pt: { mobile: 0, tablet: 4 }, minWidth: `${navWidth}px`, minHeight: { mobile: '60px', tablet: undefined } }}
      justifyContent={isMobile ? "space-between" : undefined}
      alignItems="center">
      <UserProfileAvatar />
      {!mobileMenuOpen &&
        <Stack sx={{ width: { mobile: undefined, desktop: '100%' } }}>
          {navItems.filter(ni => isMobile ? ni === activeNavItem : true).map((ni, index) =>
            <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={ni.label} />)}
        </Stack>
      }
      {mobileMenuOpen && <Typography sx={{ opacity: 0.6 }}>Menu</Typography>}
      {isMobile &&
        <>
          <IconButton size="large" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Box hidden={!mobileMenuOpen} sx={{
            position: 'fixed',
            top: '60px',
            bottom: 0,
            left: 0,
            right: 0,
            background: theme.palette.background.default,
            zIndex: 1
          }}>
            <Stack>
              {navItems.map((ni, index) =>
                <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={true} label={ni.label} />)}
            </Stack>
          </Box>
        </>
      }
    </Stack>
  );
};

export default NavProfile;
