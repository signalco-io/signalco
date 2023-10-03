'use client';

import React, { Suspense, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Channel, Close, Dashboard, Device, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { orderBy } from '@signalco/js';
import { UserProfileAvatar } from '../users/UserProfileAvatar';
import { KnownPages } from '../../src/knownPages';
import useLocale from '../../src/hooks/useLocale';
import NavLink from './NavLink';
import { MobileMenu } from './MobileMenu';
import { FloatingNavContainer } from './FloatingNavContainer';

export type NavItem = {
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

    return (
        <FloatingNavContainer>
            <div className="flex h-full min-h-[60px] flex-row items-center justify-between gap-1 sm:flex-col sm:justify-start md:pl-0 md:pt-2">
                <Suspense>
                    <UserProfileAvatar />
                </Suspense>
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
                    <IconButton
                        variant="plain"
                        onClick={() => setMobileMenuOpen((curr) => !curr)}
                        aria-label="Toggle menu">
                        {mobileMenuOpen ? <Close /> : <MenuIcon />}
                    </IconButton>
                    <MobileMenu
                        open={mobileMenuOpen}
                        items={visibleNavItems}
                        active={activeNavItem}
                        onClose={() => setMobileMenuOpen(false)} />
                </div>
            </div>
        </FloatingNavContainer>
    );
}
