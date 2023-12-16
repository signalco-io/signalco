import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { LogOut, Settings } from '@signalco/ui-icons';
import { KnownPages } from '../../src/knownPages';
import useLocale from '../../src/hooks/useLocale';
import UserProfileAvatarButton from './UserProfileAvatarButton';

export function UserProfileAvatar() {
    const { t } = useLocale('App', 'Account');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserProfileAvatarButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem href={KnownPages.Settings} startDecorator={<Settings />}>
                    {t('Settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem href={KnownPages.Logout} startDecorator={<LogOut />}>
                    {t('Logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
