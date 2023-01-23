'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import Login from '../../components/Login';
import { EmptyLayoutWithAuth } from '../../components/layouts/EmptyLayoutWithAuth';

function LoginReturnPage() {
    const { isAuthenticated } = useAuth0();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <Login />
    );
}

LoginReturnPage.layout = EmptyLayoutWithAuth;

export default LoginReturnPage;
