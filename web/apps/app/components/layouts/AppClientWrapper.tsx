'use client';

import { PropsWithChildren } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import RealtimeService from '../../src/realtime/realtimeService';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours,
        },
    },
});
const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : null,
});

export function AppClientWrapper({ children }: PropsWithChildren) {
    RealtimeService.queryClient = queryClient;

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}>
            {children}
        </PersistQueryClientProvider>
    );
}
