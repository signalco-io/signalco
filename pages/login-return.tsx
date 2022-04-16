import Login from '../components/Login';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { EmptyLayoutWithAuth } from '../components/layouts/EmptyLayoutWithAuth';

const LoginReturnPage = () => {
    const { isAuthenticated } = useAuth0();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/app');
        }
    }, [isAuthenticated, router]);

    return (
        <Login />
    );
};

LoginReturnPage.layout = EmptyLayoutWithAuth;

export default LoginReturnPage;