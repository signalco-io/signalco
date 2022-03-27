import React from "react";
import { EmptyLayout } from "./EmptyLayout";
import { Auth0Wrapper } from "./Auth0Wrapper";
import { LayoutWithAuth } from "./LayoutWithAuth";
import CurrentUserProvider from "../../src/services/CurrentUserProvider";
import { ChildrenProps } from "../../src/sharedTypes";


export function EmptyLayoutWithAuth(props: ChildrenProps) {
    if (CurrentUserProvider.isLoggedIn() || typeof window === 'undefined') {
        return <EmptyLayout>
            {props.children}
        </EmptyLayout>;
    }

    console.debug("Not logged in. Wrapping with Auth0");

    return (
        <Auth0Wrapper><LayoutWithAuth LayoutComponent={EmptyLayout}>{props.children}</LayoutWithAuth></Auth0Wrapper>
    );
}
