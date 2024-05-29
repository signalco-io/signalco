import { PropsWithChildren, useCallback, useEffect } from 'react';
import { decodeJwt } from 'jose';
import { useAuth0 } from '@auth0/auth0-react';
import UserSettingsProvider from '../../src/services/UserSettingsProvider';
import { setTokenFactory } from '../../src/services/HttpService';
import RealtimeService from '../../src/realtime/realtimeService';

export default function WithAuth({ children }: PropsWithChildren) {
    const { error, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        try {
            // Get token from cache
            const cachedToken = UserSettingsProvider.value<string | undefined>('accessToken', undefined);
            if (typeof cachedToken !== 'undefined' && cachedToken !== 'undefined' && cachedToken !== '' && cachedToken !== 'null') {
                const cachedTokenJwt = decodeJwt(cachedToken);
                if (cachedTokenJwt.exp && cachedTokenJwt.exp > Date.now() / 1000) {
                    return cachedToken;
                }
            }

            const newToken = await getAccessTokenSilently();
            UserSettingsProvider.set('accessToken', newToken);
            return newToken;
        } catch {
            await loginWithRedirect();
            return undefined;
        }
    }, [getAccessTokenSilently, loginWithRedirect]);

    setTokenFactory(getToken);

    // Initiate SignalR communication
    useEffect(() => {
        RealtimeService.startAsync();
    }, []);

    // Show error if available
    if (!isLoading && error) {
        console.warn('Layout auth error', error);
    }

    return <>{children}</>;
}
