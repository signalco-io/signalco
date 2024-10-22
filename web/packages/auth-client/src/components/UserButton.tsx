'use client';

import { useContext } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { LogOut, User } from '@signalco/ui-icons';
import { AuthContext } from '../AuthContext';

export function UserButton() {
    const authContext = useContext(AuthContext);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <IconButton className="rounded-full">
                    <Avatar className="bg-transparent">
                        <User />
                    </Avatar>
                </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem href={authContext.urls?.signOut ?? '/sign-out'} startDecorator={<LogOut />}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
