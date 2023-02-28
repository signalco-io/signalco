import { Avatar } from '@signalco/ui';
import { User } from '@auth0/auth0-spa-js';

export default function UserAvatar({ user }: { user: User | undefined }) {
    let userNameInitials = '';
    if (user?.given_name && user?.family_name) {
        userNameInitials = `${user.given_name[0]}${user.family_name[0]}`;
    }
    if (userNameInitials === '' && user?.email) {
        userNameInitials = user.email[0];
    }

    return (
        <Avatar src={user?.picture ?? '#'} alt={userNameInitials}>
            {userNameInitials}
        </Avatar>
    );
}
