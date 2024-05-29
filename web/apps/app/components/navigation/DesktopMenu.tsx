import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { UserProfileAvatar } from '../users/UserProfileAvatar';
import useLocale from '../../src/hooks/useLocale';
import { PageTitle } from './titles/PageTitle';
import { NavItem } from './NavProfile';
import NavLink from './NavLink';

export function DesktopMenu({ items, active }: { items: NavItem[]; active: NavItem | undefined; }) {
    const { t } = useLocale('App', 'Nav');

    return (
        <div className="flex h-full min-h-[50px] flex-row items-center justify-between gap-3 px-2 sm:max-w-[56px] sm:flex-col sm:justify-start sm:px-0 sm:py-2">
            <div className="flex h-full flex-row gap-3 sm:flex-col">
                <UserProfileAvatar />
                <div className="hidden size-full sm:block">
                    <Stack className="h-full">
                        {items.filter(ni => !ni.end).map((ni, index) => (
                            <NavLink
                                key={index + 1}
                                path={ni.path}
                                Icon={ni.icon}
                                active={ni === active}
                                label={t(ni.label)} />
                        ))}
                        <div className="grow" />
                        {items.filter(ni => ni.end).map((ni, index) => (
                            <NavLink
                                key={index + 1}
                                path={ni.path}
                                Icon={ni.icon}
                                active={ni === active}
                                label={t(ni.label)} />
                        ))}
                    </Stack>
                </div>
                <div className="sm:hidden">
                    <PageTitle />
                </div>
            </div>
            {/* Spacer for MobileMenu component rendered outside */}
            <div className="w-8 sm:hidden" />
        </div>
    );
}
