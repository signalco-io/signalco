'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsServer } from '@signalco/hooks/useIsServer';
import { useAuth0 } from '@auth0/auth0-react';
import Login from '../../components/Login';

export default function LoginReturnPage() {
    const { isAuthenticated } = useAuth0();
    const isServer = useIsServer();
    const router = useRouter();

    useEffect(() => {
        if (!isServer && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isServer, router]);

    return (
        <Login />
    );
}
