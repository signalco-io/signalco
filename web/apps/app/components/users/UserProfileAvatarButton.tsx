'use client';

import React, { forwardRef } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import useCurrentUser from '../../src/hooks/useCurrentUser';
import UserAvatar from './UserAvatar';

const UserProfileAvatarButton = forwardRef<HTMLButtonElement>((props, ref) => {
    const user = useCurrentUser();

    return (
        <Button variant="plain" className="w-fit self-center rounded-full p-0" aria-label="User profile" ref={ref} {...props}>
            <UserAvatar user={user} />
        </Button>
    );
});
UserProfileAvatarButton.displayName = 'UserProfileAvatarButton';

export default UserProfileAvatarButton;
