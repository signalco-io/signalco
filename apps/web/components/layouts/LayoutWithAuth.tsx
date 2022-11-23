import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ChildrenProps } from '../../src/sharedTypes';
import HttpService from '../../src/services/HttpService';
import CurrentUserProvider from '../../src/services/CurrentUserProvider';

export function LayoutWithAuth(props: { LayoutComponent: React.FC<ChildrenProps>, children?: React.ReactNode; }) {
    const {
        children, LayoutComponent
    } = props;
    const { error, isLoading, user, getAccessTokenSilently } = useAuth0();

    HttpService.tokenFactory = getAccessTokenSilently;

    useEffect(() => {
        if (!user) {
            return;
        }

        CurrentUserProvider.setCurrentUser(user);
    }, [user]);

    // Show error if available
    if (!isLoading && error) {
        console.warn('Layout auth error', error);
    }

    return <LayoutComponent>{children}</LayoutComponent>;
}
