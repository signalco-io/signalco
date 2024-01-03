'use client';

import React, { forwardRef } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import ApiBadge from '../development/ApiBadge';
import useCurrentUser from '../../src/hooks/useCurrentUser';
import UserAvatar from './UserAvatar';

const UserProfileAvatarButton = forwardRef<HTMLButtonElement>((props, ref) => {
    const user = useCurrentUser();

    return (
        <Button variant="plain" className="relative rounded-full p-0" ref={ref} {...props}>
            <UserAvatar user={user} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <ApiBadge />
            </div>
        </Button>
    );
});
UserProfileAvatarButton.displayName = 'UserProfileAvatarButton';

export default UserProfileAvatarButton;
