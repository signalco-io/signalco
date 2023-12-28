'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
                <ReactQueryDevtools initialIsOpen={false} />
                <ThemedNotificationsContainer />
                {children}
            </QueryClientProvider>
        </ThemeProvider>
    );
}
