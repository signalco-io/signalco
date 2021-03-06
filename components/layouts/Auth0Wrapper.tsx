import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { ChildrenProps } from '../../src/sharedTypes';

export function Auth0Wrapper(props: ChildrenProps) {
    const {
        children
    } = props;
    const router = useRouter();

    let redirectUri = 'https://www.signalco.io/login-return';
    if (typeof window !== 'undefined' && window.location.origin.indexOf('localhost:3000') > 0) {
        redirectUri = `${window.location.origin}/login-return`;
    } else if (typeof window !== 'undefined' && window.location.origin.indexOf('next.signalco.io') > 0) {
        redirectUri = 'https://next.signalco.io/login-return';
    }

    return (
        <Auth0Provider
            redirectUri={redirectUri}
            onRedirectCallback={(appState) => {
                // Use Next.js's Router.replace method to replace the url
                const returnTo = appState?.returnTo || '/';
                router.replace(returnTo);
            }}
            domain="dfnoise.eu.auth0.com"
            clientId="nl7QIQD7Kw3ZHt45qHHAZG0MEILSFa7U"
            audience="https://api.signalco.io"
        >
            {children}
        </Auth0Provider>
    );
}
