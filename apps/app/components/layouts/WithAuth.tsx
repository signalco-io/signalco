import { useEffect } from 'react';
import { ChildrenProps } from '@signalco/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenFactory } from '../../src/services/HttpService';
import CurrentUserProvider from '../../src/services/CurrentUserProvider';

export default function WithAuth({ children }: ChildrenProps) {
    const { error, isLoading, user, getAccessTokenSilently } = useAuth0();

    setTokenFactory(getAccessTokenSilently);

    useEffect(() => {
        if (!user) {
            return;
        }

        CurrentUserProvider.setCurrentUser(user);
    }, [user]);

    // Show error if available
    if (!isLoading && error) {
        console.warn('Layout auth error', error);
    }

    return <>{children}</>;
}
