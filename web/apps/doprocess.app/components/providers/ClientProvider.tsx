'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsContainer } from '@signalco/ui-notifications';

const queryClient = new QueryClient();

function ThemedNotificationsContainer() {
    const { resolvedTheme } = useTheme();
    return <NotificationsContainer theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />;
}

export function ClientProvider({children}: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            <QueryClientProvider client={queryClient}>
                <ThemedNotificationsContainer />
                {children}
            </QueryClientProvider>
        </ThemeProvider>
    );
}
