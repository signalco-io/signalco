import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import CurrentUserProvider from "../src/services/CurrentUserProvider";
import { ChildrenProps } from "../src/sharedTypes";
import { AppLayout } from "./AppLayout";
import { Auth0Wrapper } from "./Auth0Wrapper";
import { LayoutWithAuth } from "./LayoutWithAuth";


export function AppLayoutWithAuth(props: ChildrenProps) {
    if (CurrentUserProvider.isLoggedIn() || typeof window === 'undefined') {
        return (<AppLayout>
            {props.children}
        </AppLayout>);
    }

    console.debug("Not logged in. Wrapping with Auth0");

    return (
        <Auth0Wrapper><LayoutWithAuth LayoutComponent={withAuthenticationRequired(AppLayout)}>{props.children}</LayoutWithAuth></Auth0Wrapper>
    );
}
