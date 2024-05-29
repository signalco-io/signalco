'use client';

import React, { } from 'react';
import { Channel, Dashboard, Device, Settings } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../src/knownPages';
import { useActiveNavItem } from './useActiveNavItem';
import { MobileMenu } from './MobileMenu';
import { FloatingNavContainer } from './FloatingNavContainer';
import { DesktopMenu } from './DesktopMenu';

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

    // Hide nav in fullscreen mode
    const [isFullScreen] = useSearchParam('fullscreen');
    if (isFullScreen === 'true') {
        return null;
    }

    return (
        <FloatingNavContainer>
            <DesktopMenu items={navItems} active={activeNavItem} />
            <MobileMenu
                className="absolute right-2 top-[calc(50px/2-36px/2)] sm:hidden"
                items={navItems}
                active={activeNavItem} />
        </FloatingNavContainer>
    );
}
