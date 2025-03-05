# @signalco/ui-notifications

## Getting started

Use `NotificationsContainer` at the application root to provide notifications injection location.

```tsx
'use client';

import { PropsWithChildren } from 'react';
import { NotificationsContainer } from '@signalco/ui-notifications';

export function ClientProviders({ children }: PropsWithChildren<{}>) {
    return (
        <>
            {/*  ...other provider components */}
            <NotificationsContainer />
            {children}
        </>
    )
}
```

Then you can use `showNotification` hook to show notifications.

```tsx
import { showNotification } from '@signalco/ui-notifications';

export function MyComponent() {
    const handleAction = () => {
        showNotification('Something went wrong.', 'error');
    };

    return (
        <button onClick={handleAction}>Show notification</button>
    );
}
```

## Available functions

- `showNotification`
- `showPrompt`
- `hideNotification`
