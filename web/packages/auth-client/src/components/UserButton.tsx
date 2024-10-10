'use client';

import { useContext } from 'react';
import { Modal } from '@signalco/ui-primitives/Modal';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Button } from '@signalco/ui-primitives/Button';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { User } from '@signalco/ui-icons';
import { AuthContext } from '../AuthContext';

export function UserButton() {
    const authContext = useContext(AuthContext);
    return (
        <Modal trigger={(
            <IconButton>
                <Avatar>
                    <User />
                </Avatar>
            </IconButton>
        )}>
            <Button href={authContext.urls?.signOut ?? '/signout'}>Sign Out</Button>
        </Modal>
    );
}
