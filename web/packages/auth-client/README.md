# @signalco/auth-client

## Getting started

Use `AuthProvider` to wrap the entire application to provide authentication context.

Example imeplementation:

```tsx
'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider } from '@signalco/auth-client/components';

export type User = {
    id: string;
    displayName: string;
    email: string;
    emailNormalized: string;
    createdAt: number;
};

async function currentUserFactory() {
    const response = await fetch('/api/users/current');
    if (response.status < 200 || response.status > 299) {
        return null;
    }

    return await response.json() as User;
}

export function AuthAppProvider({ children }: PropsWithChildren) {
    return (
        <AuthProvider currentUserFactory={currentUserFactory}>
            {children}
        </AuthProvider>
    );
}
```

Then in your layout or main component, wrap the entire application with `AuthAppProvider`. Then you can use AuthProtectedSection to protect sections of your application. The `AuthProtectedSection` component will redirect to the specified URL if the user is not authenticated. This section can be located anywhere in the application where you wan't to redirect or show authorized data.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
    <AuthAppProvider>
        <AuthProtectedSection mode="redirect" redirectUrl="/login">
            {children}
        </AuthProtectedSection>
    </AuthAppProvider>
</QueryClientProvider>
```

Modes available for `AuthProtectedSection` are `hide` and `redirect`. Hide will hide the section if the user is not authenticated. Redirect will redirect the user to the specified URL.

```tsx
import { AuthProtectedSection } from '@signalco/auth-client/components';

// This will hide the section if user is not authenticated
<AuthProtectedSection mode="hide">
    {currentUser.displayName}
</AuthProtectedSection>

// This will redirect used from current page to /login if user is not authenticated
<AuthProtectedSection mode="redirect" redirectUrl="/login">
    {currentUser.displayName}
</AuthProtectedSection>
```

`useCurrentUser` hook can be used to get the current user object.

```tsx
import { useCurrentUser } from '@signalco/auth-client';

const currentUser = useCurrentUser();
```

This hook uses react-query to cache the current user object. It will make a request to the server only once and cache the result. You can clear or invalidate cache by calling react-query invalidate keys function with exported keys `authCurrentUserQueryKeys`.

## Components

There are multiple helper components available to use with the auth client.

- `SignedIn` - This component will render the children only if the user is signed in.
- `SignedOut` - This component will render the children only if the user is signed out.
- `SignInButton` - This component will render a button to sign in.
- `SignUpButton` - This component will render a button to sign up.
- `UserButton` - This component will render a button with sign out button.
