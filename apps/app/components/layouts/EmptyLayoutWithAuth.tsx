import React from 'react';
import { ChildrenProps } from '@signalco/ui';
import CurrentUserProvider from '../../src/services/CurrentUserProvider';
import { LayoutWithAuth } from './LayoutWithAuth';
import { EmptyLayout } from './EmptyLayout';
import { Auth0Wrapper } from './Auth0Wrapper';

export function EmptyLayoutWithAuth(props: ChildrenProps) {
    if (CurrentUserProvider.isLoggedIn() || typeof window === 'undefined') {
        return <EmptyLayout>
            {props.children}
        </EmptyLayout>;
    }

    console.debug('Not logged in. Wrapping with Auth0');

    return (
        <Auth0Wrapper><LayoutWithAuth LayoutComponent={EmptyLayout}>{props.children}</LayoutWithAuth></Auth0Wrapper>
    );
}
