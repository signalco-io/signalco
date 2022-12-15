import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Channel, Close, Dashboard, Device, LogOut, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { Loadable, Avatar, Button, Divider, IconButton, Menu, Tooltip, Typography, Box, MenuItemLink, ButtonProps } from '@signalco/ui';
import { Stack } from '@mui/system';
import NavLink from './navigation/NavLink';
import ApiBadge from './development/ApiBadge';
import CurrentUserProvider from '../src/services/CurrentUserProvider';
import { KnownPages } from '../src/knownPages';
import useLocale from '../src/hooks/useLocale';
import { orderBy } from '../src/helpers/ArrayHelpers';

const navItems = [
  { label: 'Channels', path: KnownPages.Channels, icon: Channel, hidden: true },
  { label: 'Settings', path: KnownPages.Settings, icon: Settings, hidden: true },
  { label: 'Dashboards', path: '/app', icon: Dashboard },
  { label: 'Entities', path: KnownPages.Entities, icon: Device }
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

function UserProfileAvatarButton(props: ButtonProps) {
  return (
    <Button variant="plain" sx={{ width: { xs: undefined, sm: '100%' }, py: 2 }} {...props} >
      <Stack alignItems="center" spacing={2} direction={{ xs: 'row', sm: 'column' }}>
        <UserAvatar />
        <ApiBadge />
      </Stack>
    </Button>
  );
}

function UserProfileAvatar() {
  const { t } = useLocale('App', 'Account');

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Loadable isLoading={isLoading} placeholder="skeletonRect" width={30} height={30}>
      <Menu
        menuId="account-menu"
        renderTrigger={UserProfileAvatarButton}>
        <MenuItemLink href={KnownPages.Settings} startDecorator={<Settings />}>
          {t('Settings')}
        </MenuItemLink>
        <Divider />
        <MenuItemLink href={KnownPages.Logout} startDecorator={<LogOut />}>
          {t('Logout')}
        </MenuItemLink>
      </Menu>
    </Loadable>
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
          background: 'var(--joy-palette-background-body)',
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
