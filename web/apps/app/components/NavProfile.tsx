'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cx } from 'classix';
import { Channel, Close, Dashboard, Device, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { orderBy } from '@signalco/js';
import { KnownPages } from '../src/knownPages';
import useLocale from '../src/hooks/useLocale';
import { UserProfileAvatar } from './users/UserProfileAvatar';
import NavLink from './navigation/NavLink';

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

export default function NavProfile() {
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
        <div className="flex min-h-[60px] flex-row items-center justify-between gap-1 sm:flex-col sm:justify-start">
            <UserProfileAvatar />
            <div className="hidden w-full sm:block">
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
                <div className={cx(
                    'fixed inset-0 top-[60px] z-50 bg-white',
                    !mobileMenuOpen && 'hidden'
                )}>
                    <Stack>
                        {visibleNavItems.map((ni, index) =>
                            (<NavLink
                                key={index + 1}
                                path={ni.path}
                                Icon={ni.icon}
                                active={ni === activeNavItem}
                                label={t(ni.label)}
                                onClick={handleMobileMenuClose} />))}
                    </Stack>
                </div>
            </div>
        </div>
    );
}
