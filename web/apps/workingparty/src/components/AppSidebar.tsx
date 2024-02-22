'use client';
import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { Button } from '@signalco/ui-primitives/Button';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { LogOut, Settings } from '@signalco/ui-icons';

export function AppSidebar({ children }: PropsWithChildren) {
    return (
        <Stack spacing={2} className="p-2">
            <div>
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
                        <DropdownMenuItem startDecorator={<Settings className="w-5" />}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400" startDecorator={<LogOut className="w-5" />}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {children}
        </Stack>
    );
}
