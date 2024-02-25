import { PropsWithChildren } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { LogOut, Settings } from '@signalco/ui-icons';
import { KnownPages } from '../knownPages';
import { AppSidebarUsage } from './AppSidebarUsage';

export function AppSidebar({ children }: PropsWithChildren) {
    return (
        <div className={cx('select-none grid h-screen w-full grid-rows-[auto_auto_auto_1fr_auto] gap-2 overflow-hidden')}>
            <div className="p-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            startDecorator={<Avatar size="md">A</Avatar>}
                            variant="plain"
                            className="gap-2 pl-1 pr-2">
                            Aleksandar Toplek
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            startDecorator={<Settings className="w-5" />}
                            href={KnownPages.AppSettings}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400" startDecorator={<LogOut className="w-5" />}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {children}
            <AppSidebarUsage />
        </div>
    );
}
