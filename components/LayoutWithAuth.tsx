import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import HttpService from "../src/services/HttpService";
import * as Sentry from '@sentry/nextjs';
import CurrentUserProvider from "../src/services/CurrentUserProvider";


export function LayoutWithAuth(props: { LayoutComponent: React.ComponentType; children?: React.ReactNode; }) {
    const {
        children, LayoutComponent
    } = props;
    const { error, isLoading, user, getAccessTokenSilently } = useAuth0();

    HttpService.tokenFactory = getAccessTokenSilently;

    // Set sentry user
    useEffect(() => {
        if (!user) {
            return;
        }

        CurrentUserProvider.setCurrentUser(user);

        // Set sentry user
        Sentry.configureScope(scope => {
            scope.setUser({ email: user.email });
        });
    }, [user]);

    // Show error if available
    if (!isLoading && error) {
        console.warn('Layout auth error', error);
    }

    return <LayoutComponent>{children}</LayoutComponent>;
}
