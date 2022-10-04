import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import Skeleton from '@mui/material/Skeleton';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DevicesOtherSharpIcon from '@mui/icons-material/DevicesOtherSharp';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import CommitIcon from '@mui/icons-material/Commit';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';
import useIsMobile from 'src/hooks/useIsMobile';
import ApiBadge from './development/ApiBadge';
import LocalStorageService from '../src/services/LocalStorageService';
import CurrentUserProvider from '../src/services/CurrentUserProvider';
import useUserSetting from '../src/hooks/useUserSetting';
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
      <Skeleton variant="circular">
        <Avatar variant="circular" />
      </Skeleton>
    );
  }

  let userNameInitials = '';
  if (user.given_name && user.family_name) {
    userNameInitials = `${user.given_name[0]}${user.family_name[0]}`;
  }
  if (userNameInitials === '' && user.email) {
    userNameInitials = user.email[0];
  }

  const size = { xs: '36px', sm: '42px', lg: '58px' };

  if (user.picture) {
    return (<Avatar sx={{ width: size, height: size }} variant="circular" src={user.picture} alt={userNameInitials}>
      {userNameInitials}
    </Avatar>);
  }

  return (
    <Avatar sx={{ width: size, height: size }}>{userNameInitials}</Avatar>
  );
}

function UserProfileAvatar() {
  const { t } = useLocale('App', 'Account');
  const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' });
  const navWidth = useNavWidth();
  const maxWidth = navWidth - 16;
  const router = useRouter();

  const isMobile = useIsMobile();

  const user = CurrentUserProvider.getCurrentUser();
  const [userNickName] = useUserSetting<string>('nickname', user?.name ?? '');

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

  return (
    <>
      <ButtonBase {...bindTrigger(popupState)} sx={{ width: { xs: undefined, sm: '100%' }, py: 1 }}>
        <Stack alignItems="center" spacing={2} direction={{ xs: 'row', sm: 'column' }}>
          <UserAvatar />
          {!isMobile &&
            <Typography variant="h5" fontWeight={500} sx={{ maxWidth: `${maxWidth}px` }}>{userNickName}</Typography>
          }
          <ApiBadge />
        </Stack>
      </ButtonBase>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={navigateTo('/app/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>{t('Settings')}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>{t('Logout')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export const useNavWidth = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isLaptopOrTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  if (isMobile)
    return 0;
  return isLaptopOrTablet ? 109 : 228;
};

function NavLink({ path, Icon, active, label, onClick }: { path: string, Icon: SvgIconComponent, active: boolean, label: string, onClick?: () => void }) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isNotDesktop = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Link href={path} passHref>
      <Button
        sx={{
          py: { xs: 2, lg: 3 },
          px: 2
        }}
        aria-label={label}
        title={label}
        size="large"
        onClick={onClick}>
        <Stack direction="row" sx={{ width: isNotDesktop ? '100%' : '128px' }} alignItems="center" spacing={isMobile ? 1 : 0}>
          <Icon sx={{ opacity: active ? 1 : 0.6, mr: { xs: 0, lg: 2 }, fontSize: { xs: '26px', lg: '17px' } }} />
          {(isMobile || !isNotDesktop) &&
            <Typography variant="h5" fontWeight={500} sx={{ opacity: active ? 1 : 0.6, }}>{label}</Typography>
          }
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
  const navWidth = useNavWidth();
  const { t } = useLocale('App', 'Nav');

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

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
      sx={{ px: { xs: 2, sm: 0 }, pt: { xs: 0, sm: 4 }, minWidth: `${navWidth}px`, minHeight: { xs: '60px', sm: undefined } }}
      justifyContent={isMobile ? 'space-between' : undefined}
      alignItems="center">
      <Suspense>
        <UserProfileAvatar />
      </Suspense>
      {!mobileMenuOpen &&
        <Stack sx={{ width: { xs: undefined, lg: '100%' } }}>
          {visibleNavItems
            .filter(ni => isMobile ? ni === activeNavItem : true)
            .map((ni, index) => (
              <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={t(ni.label)} />
            ))}
        </Stack>
      }
      {(isMobile && mobileMenuOpen) && <Typography sx={{ opacity: 0.6 }}>Menu</Typography>}
      {isMobile &&
        <>
          <IconButton size="large" onClick={handleMobileMenuOpenClick}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Box hidden={!mobileMenuOpen} sx={{
            position: 'fixed',
            top: '60px',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--mui-palette-background-default)',
            zIndex: 999
          }}>
            <Stack>
              {visibleNavItems.map((ni, index) =>
                <NavLink key={index + 1} path={ni.path} Icon={ni.icon} active={ni === activeNavItem} label={t(ni.label)} onClick={handleMobileMenuClose} />)}
            </Stack>
          </Box>
        </>
      }
    </Stack>
  );
}

export default NavProfile;
