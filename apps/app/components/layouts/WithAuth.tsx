import { useCallback, useEffect } from 'react';
import { ChildrenProps } from '@signalco/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenFactory } from '../../src/services/HttpService';
import RealtimeService from '../../src/realtime/realtimeService';

export default function WithAuth({ children }: ChildrenProps) {
    const { error, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        try {
            return await getAccessTokenSilently();
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
