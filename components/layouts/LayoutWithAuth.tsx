import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { ChildrenProps } from 'src/sharedTypes';
import CurrentUserProvider from '../../src/services/CurrentUserProvider';
import HttpService from '../../src/services/HttpService';

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
