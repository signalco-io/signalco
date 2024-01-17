'use client';

import React, { } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Channel, Dashboard, Device, Settings } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { UserProfileAvatar } from '../users/UserProfileAvatar';
import { KnownPages } from '../../src/knownPages';
import useLocale from '../../src/hooks/useLocale';
import { useActiveNavItem } from './useActiveNavItem';
import { PageTitle } from './titles/PageTitle';
import NavLink from './NavLink';
import { MobileMenu } from './MobileMenu';
import { FloatingNavContainer } from './FloatingNavContainer';

export type NavItem = {
    label: string,
    path: string,
    icon: React.FunctionComponent,
    end?: boolean | undefined;
}

export const navItems: NavItem[] = [
    { label: 'Spaces', path: KnownPages.Spaces, icon: Dashboard },
    { label: 'Entities', path: KnownPages.Entities, icon: Device },
    { label: 'Channels', path: KnownPages.Channels, icon: Channel, end: true },
    { label: 'Settings', path: KnownPages.Settings, icon: Settings, end: true },
];

export default function NavProfile() {
    const activeNavItem = useActiveNavItem();
    const { t } = useLocale('App', 'Nav');

    // Hide nav in fullscreen mode
    const [isFullScreen] = useSearchParam('fullscreen');
    if (isFullScreen === 'true') {
        return null;
    }

    return (
        <FloatingNavContainer>
            <div className="flex h-full min-h-[50px] flex-row items-center justify-between gap-3 px-2 sm:flex-col sm:justify-start sm:px-0 sm:py-2">
                <div className="flex h-full flex-row gap-3 sm:flex-col">
                    <UserProfileAvatar />
                    <div className="hidden size-full sm:block">
                        <Stack className="h-full">
                            {navItems.filter(ni => !ni.end).map((ni, index) => (
                                <NavLink
                                    key={index + 1}
                                    path={ni.path}
                                    Icon={ni.icon}
                                    active={ni === activeNavItem}
                                    label={t(ni.label)} />
                            ))}
                            <div className="grow" />
                            {navItems.filter(ni => ni.end).map((ni, index) => (
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
                        <PageTitle />
                    </div>
                </div>
                {/* Spacer for MobileMenu component rendered outside */}
                <div className="w-8" />
            </div>
            <MobileMenu
                className="absolute right-2 top-[calc(50px/2-36px/2)] sm:hidden"
                items={navItems}
                active={activeNavItem} />
        </FloatingNavContainer>
    );
}
