'use client';

import { useRouter } from 'next/navigation';
import { useIsServer } from '@signalco/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import Login from '../../components/Login';

export default function LoginReturnPage() {
    const { isAuthenticated } = useAuth0();
    const isServer = useIsServer();
    const router = useRouter();

    console.log({isAuthenticated, isServer})
    if (!isServer && isAuthenticated) {
        router.push('/', {forceOptimisticNavigation: true});
    }

    return (
        <Login />
    );
}
