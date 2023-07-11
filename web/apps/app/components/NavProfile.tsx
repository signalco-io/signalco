import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Channel, Close, Dashboard, Device, Menu as MenuIcon, LogOut, Settings } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Menu, MenuItem } from '@signalco/ui/dist/Menu';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Divider } from '@signalco/ui/dist/Divider';
import { Button } from '@signalco/ui/dist/Button';
import { orderBy } from '@signalco/js';
import { KnownPages } from '../src/knownPages';
import useLocale from '../src/hooks/useLocale';
import useCurrentUser from '../src/hooks/useCurrentUser';
import UserAvatar from './users/UserAvatar';
import NavLink from './navigation/NavLink';
import ApiBadge from './development/ApiBadge';

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

function UserProfileAvatarButton() {
    const user = useCurrentUser();

    return (
        <div className="p-2 relative">
            <Button variant="plain" className="py-6">
                <UserAvatar user={user} />
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2">
                    <ApiBadge />
                </div>
            </Button>
        </div>
    );
}

function UserProfileAvatar() {
    const { t } = useLocale('App', 'Account');

    return (
        <Menu trigger={<UserProfileAvatarButton />}>
            <MenuItem href={KnownPages.Settings} startDecorator={<Settings />}>
                {t('Settings')}
            </MenuItem>
            <Divider />
            <MenuItem href={KnownPages.Logout} startDecorator={<LogOut />}>
                {t('Logout')}
            </MenuItem>
        </Menu>
    );
}

function NavProfile() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const activeNavItem: NavItem | undefined = orderBy(navItems.filter(ni => pathname?.startsWith(ni.path)), (a, b) => b.path.length - a.path.length).at(0);
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
        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center min-h-[60px] gap-1">
            <UserProfileAvatar />
            <div className="w-full hidden sm:block">
                <Stack>
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
            </div>
            <div className="sm:hidden">
                <IconButton variant="plain" size="lg" onClick={handleMobileMenuOpenClick} aria-label="Toggle menu">
                    {mobileMenuOpen ? <Close /> : <MenuIcon />}
                </IconButton>
                <div className="fixed top-[60px] bottom-0 left-0 right-0 z-50 bg-current" style={{
                    display: !mobileMenuOpen ? 'none' : 'block',
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
                </div>
            </div>
        </div>
    );
}

export default NavProfile;
