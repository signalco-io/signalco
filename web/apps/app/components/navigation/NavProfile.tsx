'use client';

import React, { Suspense, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Channel, Close, Dashboard, Device, Menu as MenuIcon, Settings } from '@signalco/ui-icons';
import { UserProfileAvatar } from '../users/UserProfileAvatar';
import { KnownPages } from '../../src/knownPages';
import useLocale from '../../src/hooks/useLocale';
import { useActiveNavItem } from './useActiveNavItem';
import { PageTitle } from './PageTitle';
import NavLink from './NavLink';
import { MobileMenu } from './MobileMenu';
import { FloatingNavContainer } from './FloatingNavContainer';

export type NavItem = {
    label: string,
    path: string,
    icon: React.FunctionComponent,
    hidden?: boolean | undefined;
}

export const navItems: NavItem[] = [
    { label: 'Channels', path: KnownPages.Channels, icon: Channel, hidden: true },
    { label: 'Settings', path: KnownPages.Settings, icon: Settings, hidden: true },
    { label: 'Spaces', path: KnownPages.Spaces, icon: Dashboard },
    { label: 'Entities', path: KnownPages.Entities, icon: Device }
];

export default function NavProfile() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const activeNavItem = useActiveNavItem();
    const visibleNavItems = navItems.filter(ni => ni === activeNavItem || !ni.hidden);
    const { t } = useLocale('App', 'Nav');

    return (
        <FloatingNavContainer>
            <div className="flex h-full min-h-[60px] flex-row items-center justify-between gap-3 sm:flex-col sm:justify-start sm:pl-0 sm:pt-2">
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
                <div className="absolute left-1/2 -translate-x-1/2 sm:hidden">
                    <Suspense>
                        <PageTitle />
                    </Suspense>
                </div>
                <div className="sm:hidden">
                    <IconButton
                        variant="plain"
                        onClick={() => setMobileMenuOpen((curr) => !curr)}
                        aria-label="Toggle menu">
                        {mobileMenuOpen ? <Close /> : <MenuIcon />}
                    </IconButton>
                </div>
            </div>
            <MobileMenu
                open={mobileMenuOpen}
                items={visibleNavItems}
                active={activeNavItem}
                onClose={() => setMobileMenuOpen(false)} />
        </FloatingNavContainer>
    );
}
