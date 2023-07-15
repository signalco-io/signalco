'use client';

import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Minimize } from '@signalco/ui-icons';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { useSearchParam } from '@signalco/hooks';
import NavProfile from '../NavProfile';
import RealtimeService from '../../src/realtime/realtimeService';
import { AuthWrapper } from './AuthWrapper';

const queryClient = new QueryClient();

export function AppLayout(props: React.PropsWithChildren) {
    const {
        children
    } = props;
    const [isFullScreen, setFullScreen] = useSearchParam('fullscreen');

    RealtimeService.queryClient = queryClient;

    return (
        <AuthWrapper>
            <QueryClientProvider client={queryClient}>
                <div className="flex h-screen w-full flex-col sm:flex-row">
                    {isFullScreen !== 'true' && (
                        <NavProfile />
                    )}
                    <div className="relative h-screen w-full grow overflow-hidden">
                        {children}
                    </div>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
                {isFullScreen && (
                    <div className="fixed bottom-3 right-3">
                        <IconButton
                            size="lg"
                            aria-label="Exit fullscreen"
                            onClick={() => setFullScreen(undefined)}>
                            <Minimize />
                        </IconButton>
                    </div>
                )}
            </QueryClientProvider>
        </AuthWrapper>
    );
}
