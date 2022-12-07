'use client';

import { useRouter } from 'next/navigation';
import { Loadable, Row } from '@signalco/ui';
import LocalStorageService from '../../../src/services/LocalStorageService';
import CurrentUserProvider from '../../../src/services/CurrentUserProvider';
import { KnownPages } from '../../../src/knownPages';
import useIsClient from '../../../src/hooks/useIsClient';

export default function AppLogoutPage() {
    const isClient = useIsClient();
    const router = useRouter();
    if (isClient) {
        LocalStorageService.setItem('token', undefined);
        CurrentUserProvider.setToken(undefined);
        router.push(KnownPages.Root);
    }

    return (
        <div style={{ padding: 42 }}>
            <Row spacing={2} justifyContent="center">
                <Loadable isLoading></Loadable>
                <div>Logging you out...</div>
            </Row>
        </div>
    );
}
