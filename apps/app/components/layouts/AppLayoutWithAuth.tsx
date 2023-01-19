import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { ChildrenProps } from '../../src/sharedTypes';
import CurrentUserProvider from '../../src/services/CurrentUserProvider';
import { LayoutWithAuth } from './LayoutWithAuth';
import { Auth0Wrapper } from './Auth0Wrapper';
import { AppLayout } from './AppLayout';


export function AppLayoutWithAuth(props: ChildrenProps) {
    if (CurrentUserProvider.isLoggedIn() || typeof window === 'undefined') {
        return (
            <AppLayout>
                {props.children}
            </AppLayout>
        );
    }

    console.debug('Not logged in. Wrapping with Auth0');

    return (
        <Auth0Wrapper>
            <LayoutWithAuth LayoutComponent={withAuthenticationRequired(AppLayout)}>
                {props.children}
            </LayoutWithAuth>
        </Auth0Wrapper>
    );
}
