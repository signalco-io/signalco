import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { Box, Stack } from '@mui/system';
import { Avatar, Button, Divider, IconButton, ListItemDecorator, Menu, MenuItem, Typography } from '@mui/joy';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DevicesOtherSharpIcon from '@mui/icons-material/DevicesOtherSharp';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import CommitIcon from '@mui/icons-material/Commit';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';
import Loadable from './shared/Loadable/Loadable';
import ApiBadge from './development/ApiBadge';
import LocalStorageService from '../src/services/LocalStorageService';
import CurrentUserProvider from '../src/services/CurrentUserProvider';
import useLocale from '../src/hooks/useLocale';
import { orderBy } from '../src/helpers/ArrayHelpers';

const navItems = [
  { label: 'Channels', path: '/app/channels', icon: CommitIcon, hidden: true },
  { label: 'Settings', path: '/app/settings', icon: SettingsIcon, hidden: true },
  { label: 'Dashboards', path: '/app', icon: DashboardSharpIcon },
  { label: 'Entities', path: '/app/entities', icon: DevicesOtherSharpIcon }
];

function UserAvatar() {
  const user = CurrentUserProvider.getCurrentUser();
  if (user === undefined) {
    return (
      <Avatar />
    );
  }

  let userNameInitials = '';
  if (user.given_name && user.family_name) {
    userNameInitials = `${user.given_name[0]}${user.family_name[0]}`;
  }
  if (userNameInitials === '' && user.email) {
    userNameInitials = user.email[0];
  }

  if (user.picture) {
    return (
      <Avatar src={user.picture} alt={userNameInitials}>
        {userNameInitials}
      </Avatar>
    );
  }

  return (
    <Avatar>{userNameInitials}</Avatar>
  );
}

function UserProfileAvatar() {
  const { t } = useLocale('App', 'Account');
  const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' });
  const router = useRouter();

  const logout = async () => {
    popupState.close();
    LocalStorageService.setItem('token', undefined);
    CurrentUserProvider.setToken(undefined);
    await router.push('/');
  }

  const navigateTo = (href: string) => async () => {
    popupState.close();
    await router.push(href);
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Loadable isLoading={isLoading} placeholder="skeletonRect" width={30} height={30}>
      <Button {...bindTrigger(popupState)} variant="plain" sx={{ width: { xs: undefined, sm: '100%' }, py: 1 }}>
        <Stack alignItems="center" spacing={2} direction={{ xs: 'row', sm: 'column' }}>
          <UserAvatar />
          <ApiBadge />
        </Stack>
      </Button>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={navigateTo('/app/settings')}>
          <ListItemDecorator>
            <SettingsIcon />
          </ListItemDecorator>
          {t('Settings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemDecorator>
            <ExitToAppIcon />
          </ListItemDecorator>
          {t('Logout')}
        </MenuItem>
      </Menu>
    </Loadable>
  );
}

function NavLink({ path, Icon, active, label, onClick }: { path: string, Icon: SvgIconComponent, active: boolean, label: string, onClick?: () => void }) {
  return (
    <Link href={path} passHref>
      <Button
        sx={{
          py: { xs: 2, lg: 3 },
          px: 2
        }}
        aria-label={label}
        title={label}
        variant="plain"
        size="lg"
        onClick={onClick}>
        <Stack direction="row" alignItems="center">
          <Icon sx={{ opacity: active ? 1 : 0.6, mr: { xs: 0, lg: 2 }, fontSize: { xs: '26px', lg: '17px' } }} />
          <Typography fontWeight={500} sx={{ opacity: active ? 1 : 0.6, }}>{label}</Typography>
        </Stack>
      </Button>
    </Link>
  );
}

function NavProfile() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeNavItem = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), (a, b) => b.path.length - a.path.length)[0];
  const visibleNavItems = navItems.filter(ni => ni === activeNavItem || !ni.hidden);
  const { t } = useLocale('App', 'Nav');

  const handleMobileMenuOpenClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  }

  console.log('NavProfile rendered');

  return (
    <Stack
      direction={{ xs: 'row', sm: 'column' }}
      spacing={{ xs: 0, sm: 4 }}
      sx={{ px: { xs: 2, sm: 0 }, pt: { xs: 0, sm: 4 }, minHeight: { xs: '60px', sm: undefined } }}
      alignItems="center">
      <UserProfileAvatar />
      {!mobileMenuOpen &&
        <Stack sx={{ width: { xs: undefined, lg: '100%' } }}>
          {visibleNavItems
            .map((ni, index) => (
              <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={t(ni.label)} />
            ))}
        </Stack>
      }
      {mobileMenuOpen && <Typography sx={{ opacity: 0.6 }}>Menu</Typography>}
      <>
        <IconButton size="lg" onClick={handleMobileMenuOpenClick} aria-label="Toggle menu">
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Box hidden={!mobileMenuOpen} sx={{
          position: 'fixed',
          top: '60px',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--joy-palette-background-default)',
          zIndex: 999
        }}>
          <Stack>
            {visibleNavItems.map((ni, index) =>
              <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={t(ni.label)} onClick={handleMobileMenuClose} />)}
          </Stack>
        </Box>
      </>
    </Stack>
  );
}

export default NavProfile;
