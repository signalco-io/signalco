import { Avatar } from '@signalco/ui-primitives/Avatar';
import { User } from '@auth0/auth0-spa-js';

export default function UserAvatar({ user }: { user: User | undefined }) {
    let userNameInitials = '';
    if (user?.given_name && user?.family_name) {
        userNameInitials = `${user.given_name[0]}${user.family_name[0]}`;
    }

    const userEmail = user?.email;
    if (userNameInitials === '' && userEmail) {
        userNameInitials = userEmail[0] ? userEmail[0] : 'S';
    }

    if (!user?.picture) {
        return <Avatar>{userNameInitials}</Avatar>;
    }

    return (
        <Avatar src={user?.picture ?? '#'} alt={userNameInitials} />
    );
}
