import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Channel, Close, Dashboard, Device, LogOut, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { Button, Divider, IconButton, Menu, Typography, Box, MenuItemLink, ButtonProps, MuiStack } from '@signalco/ui';
import UserAvatar from './users/UserAvatar';
import NavLink from './navigation/NavLink';
import ApiBadge from './development/ApiBadge';
import { getCurrentUserAsync } from '../src/services/CurrentUserProvider';
import { KnownPages } from '../src/knownPages';
import useLocale from '../src/hooks/useLocale';
import useLoadAndError from '../src/hooks/useLoadAndError';
import { orderBy } from '../src/helpers/ArrayHelpers';

type NavItem = {
  label: string,
  path: string,
  icon: React.FunctionComponent,
  hidden?: boolean | undefined;
}

const navItems: NavItem[] = [
    { label: 'Channels', path: KnownPages.Channels, icon: Channel, hidden: true },
    { label: 'Settings', path: KnownPages.Settings, icon: Settings, hidden: true },
    { label: 'Dashboards', path: KnownPages.Root, icon: Dashboard },
    { label: 'Entities', path: KnownPages.Entities, icon: Device }
];

function UserProfileAvatarButton(props: ButtonProps) {
    const user = useLoadAndError(getCurrentUserAsync);

    return (
        <Button variant="plain" sx={{ width: { xs: undefined, sm: '100%' }, py: 2 }} {...props}>
            <MuiStack alignItems="center" spacing={2} direction={{ xs: 'row', sm: 'column' }}>
                <UserAvatar user={user.item} />
                <ApiBadge />
            </MuiStack>
        </Button>
    );
}

function UserProfileAvatar() {
    const { t } = useLocale('App', 'Account');

    return (
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
    );
}

function NavProfile() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const activeNavItem: NavItem | undefined = orderBy(navItems.filter(ni => router.pathname.startsWith(ni.path)), (a, b) => b.path.length - a.path.length).at(0);
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
        <MuiStack
            direction={{ xs: 'row', sm: 'column' }}
            sx={{
                minHeight: { xs: '60px', sm: undefined },
                justifyContent: { xs: 'space-between', sm: 'start' }
            }}
            alignItems="center">
            <UserProfileAvatar />
            <Box sx={{ display: { xs: 'none', sm: 'inherit', width: '100%' } }}>
                <MuiStack sx={{ width: { xs: undefined, sm: '100%' } }}>
                    {visibleNavItems
                        .map((ni, index) => (
                            <NavLink
                                key={index + 1}
                                path={ni.path}
                                Icon={ni.icon}
                                active={ni === activeNavItem}
                                label={t(ni.label)} />
                        ))}
                </MuiStack>
            </Box>
            <Typography sx={{
                display: { xs: 'inherit', sm: 'none' },
                opacity: 0.6
            }}>
                {mobileMenuOpen ? 'Menu' : (activeNavItem?.label ?? '')}
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
                    <MuiStack>
                        {visibleNavItems.map((ni, index) =>
                            <NavLink
                                key={index + 1}
                                path={ni.path}
                                Icon={ni.icon}
                                active={ni === activeNavItem}
                                label={t(ni.label)}
                                onClick={handleMobileMenuClose} />)}
                    </MuiStack>
                </Box>
            </Box>
        </MuiStack>
    );
}

export default NavProfile;
