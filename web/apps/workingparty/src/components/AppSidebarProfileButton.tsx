'use client';

import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { Button } from '@signalco/ui-primitives/Button';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { LogOut, Settings } from '@signalco/ui-icons';
import { initials } from '@signalco/js';
import { KnownPages } from '../knownPages';
import { useCurrentUser } from '../hooks/data/users/useCurrentUser';

export function AppSidebarProfileButton() {
    const currentUser = useCurrentUser();

    const displayNameInitials = initials(currentUser.data?.user?.displayName ?? '');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    startDecorator={<Avatar size="md">{displayNameInitials}</Avatar>}
                    variant="plain"
                    className="gap-2 pl-1 pr-2">
                    {currentUser.isLoading ? (
                        <Skeleton className="h-6 w-36" />
                    ) : currentUser.data?.user?.displayName}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    startDecorator={<Settings className="w-5" />}
                    href={KnownPages.AppSettings}>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    startDecorator={<LogOut className="w-5" />}
                    href={KnownPages.AppLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
