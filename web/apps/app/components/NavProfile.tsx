import React, { ComponentProps, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Channel, Close, Dashboard, Device, Menu as MenuIcon, LogOut, Settings } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Menu, MenuItemLink } from '@signalco/ui/dist/Menu';
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

function UserProfileAvatarButton(props: ComponentProps<typeof Button>) {
    const user = useCurrentUser();

    return (
        <Button variant="plain" sx={{ width: { xs: undefined, sm: '100%' }, py: 2 }} {...props} style={{ position: 'relative' }}>
            <UserAvatar user={user} />
            <div style={{ position: 'absolute', left: '50%', bottom: 4, transform: 'translateX(-50%)' }}>
                <ApiBadge />
            </div>
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
        <div className="flex xs:flex-row sm:flex-column xs:justify-between sm:justify-start items-center xs:min-h-60 gap-1">
            <UserProfileAvatar />
            <div className="width-full xs:hidden">
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
                <IconButton size="lg" onClick={handleMobileMenuOpenClick} aria-label="Toggle menu">
                    {mobileMenuOpen ? <Close /> : <MenuIcon />}
                </IconButton>
                <div style={{
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
