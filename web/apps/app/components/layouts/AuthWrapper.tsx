'use client';

import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Auth0Provider } from '@auth0/auth0-react';
import WithAuth from './WithAuth';

export function AuthWrapper(props: PropsWithChildren) {
    const {
        children
    } = props;
    const router = useRouter();

    let redirectUri = 'https://app.signalco.io/login-return';
    if (typeof window !== 'undefined' && window.location.origin.indexOf('localhost:3001') > 0) {
        redirectUri = `${window.location.origin}/login-return`;
    } else if (typeof window !== 'undefined' && window.location.origin.indexOf('app.signalco.dev') > 0) {
        redirectUri = 'https://app.signalco.dev/login-return';
    }

    return (
        <Auth0Provider
            authorizationParams={{
                redirect_uri: redirectUri,
                audience: 'https://api.signalco.io',
                scope: 'profile email'
            }}
            onRedirectCallback={(appState) => {
                // Use Next.js's Router.replace method to replace the url
                const returnTo = appState?.returnTo || '/';
                router.replace(returnTo);
            }}
            domain="dfnoise.eu.auth0.com"
            clientId="nl7QIQD7Kw3ZHt45qHHAZG0MEILSFa7U"
        >
            <WithAuth>
                {children}
            </WithAuth>
        </Auth0Provider>
    );
}
