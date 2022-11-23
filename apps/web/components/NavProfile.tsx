import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { Channel, Close, Dashboard, Device, LogOut, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { Loadable, Avatar, Button, Divider, IconButton, ListItemContent, ListItemDecorator, Menu, MenuItem, Sheet, Tooltip, Typography, Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import ApiBadge from './development/ApiBadge';
import LocalStorageService from '../src/services/LocalStorageService';
import CurrentUserProvider from '../src/services/CurrentUserProvider';
import useLocale from '../src/hooks/useLocale';
import { orderBy } from '../src/helpers/ArrayHelpers';

const navItems = [
  { label: 'Channels', path: '/app/channels', icon: Channel, hidden: true },
  { label: 'Settings', path: '/app/settings', icon: Settings, hidden: true },
  { label: 'Dashboards', path: '/app', icon: Dashboard },
  { label: 'Entities', path: '/app/entities', icon: Device }
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

  const { anchorReference, ...menuProps } = bindMenu(popupState);

  return (
    <Loadable isLoading={isLoading} placeholder="skeletonRect" width={30} height={30}>
      <Button {...bindTrigger(popupState)} variant="plain" sx={{ width: { xs: undefined, sm: '100%' }, py: 2 }}>
        <Stack alignItems="center" spacing={2} direction={{ xs: 'row', sm: 'column' }}>
          <UserAvatar />
          <ApiBadge />
        </Stack>
      </Button>
      <Menu {...menuProps}>
        <MenuItem onClick={navigateTo('/app/settings')}>
          <ListItemDecorator>
            <Settings />
          </ListItemDecorator>
          <ListItemContent>
            {t('Settings')}
          </ListItemContent>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemDecorator>
            <LogOut />
          </ListItemDecorator>
          <ListItemContent>
            {t('Logout')}
          </ListItemContent>
        </MenuItem>
      </Menu>
    </Loadable>
  );
}

function NavLink({ path, Icon, active, label, onClick }: { path: string, Icon: React.FunctionComponent, active: boolean, label: string, onClick?: () => void }) {
  return (
    <Tooltip title={label}>
      <Link href={path}>
        <IconButton
          aria-label={label}
          title={label}
          variant="plain"
          size="lg"
          sx={{
            p: 2,
            width: '100%'
          }}
          onClick={onClick}>
          <Box sx={{ opacity: active ? 1 : 0.6, fontSize: '26px' }}>
            <Icon />
          </Box>
        </IconButton>
      </Link>
    </Tooltip>
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
      sx={{
        minHeight: { xs: '60px', sm: undefined },
        justifyContent: { xs: 'space-between', sm: 'start' }
      }}
      alignItems="center">
      <UserProfileAvatar />
      <Box sx={{ display: { xs: 'none', sm: 'inherit', width: '100%' } }}>
        <Stack sx={{ width: { xs: undefined, sm: '100%' } }}>
          {visibleNavItems
            .map((ni, index) => (
              <NavLink
                key={index + 1}
                path={ni.path}
                Icon={ni.icon}
                active={ni === activeNavItem}
                label={t(ni.label)} />
            ))}
        </Stack>
      </Box>
      <Typography sx={{
        display: { xs: 'inherit', sm: 'none' },
        opacity: 0.6
      }}>
        {mobileMenuOpen ? 'Menu' : activeNavItem.label}
      </Typography>
      <Box sx={{ display: { xs: 'inherit', sm: 'none' } }}>
        <IconButton size="lg" onClick={handleMobileMenuOpenClick} aria-label="Toggle menu">
          {mobileMenuOpen ? <Close /> : <MenuIcon />}
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
              <NavLink
                key={index + 1}
                path={ni.path}
                Icon={ni.icon}
                active={ni === activeNavItem}
                label={t(ni.label)}
                onClick={handleMobileMenuClose} />)}
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default NavProfile;
