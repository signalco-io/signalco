'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { NotificationsContainer } from '@signalco/ui-notifications';

function ThemedNotificationsContainer() {
    const { resolvedTheme } = useTheme();
    return <NotificationsContainer theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />;
}

export function SharedClientProvider({ children }: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            <ThemedNotificationsContainer />
            {children}
        </ThemeProvider>
    );
}
