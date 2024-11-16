import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { LogOut } from '@signalco/ui-icons';
import { KnownPages } from '../../src/knownPages';
import useLocale from '../../src/hooks/useLocale';
import UserProfileAvatarButton from './UserProfileAvatarButton';

export function UserProfileAvatar() {
    const { t } = useLocale('App', 'Account');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UserProfileAvatarButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem href={KnownPages.Logout} startDecorator={<LogOut />}>
                    {t('Logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
