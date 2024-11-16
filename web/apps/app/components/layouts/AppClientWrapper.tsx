'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RealtimeService from '../../src/realtime/realtimeService';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours,
        },
    },
});
export function AppClientWrapper({ children }: PropsWithChildren) {
    RealtimeService.queryClient = queryClient;

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
