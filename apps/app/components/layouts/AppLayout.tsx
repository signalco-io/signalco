'use client';

import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Minimize } from '@signalco/ui-icons';
import { ChildrenProps, IconButton, MuiStack, Tooltip } from '@signalco/ui';
import { useSearchParam } from '@signalco/hooks';
import NavProfile from '../NavProfile';
import RealtimeService from '../../src/realtime/realtimeService';
import { AuthWrapper } from './AuthWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function AppLayout(props: ChildrenProps) {
    const {
        children
    } = props;
    const [isFullScreen, setFullScreen] = useSearchParam('fullscreen');

    RealtimeService.queryClient = queryClient;

    return (
        <AuthWrapper>
            <QueryClientProvider client={queryClient}>
                <MuiStack sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '100vh', width: '100%' }}>
                    {isFullScreen !== 'on' && (
                        <NavProfile />
                    )}
                    <div style={{ height: '100vh', overflow: 'auto', width: '100%', flexGrow: 1, position: 'relative' }}>
                        {children}
                    </div>
                </MuiStack>
                <ReactQueryDevtools initialIsOpen={false} />
                {isFullScreen && (
                    <Tooltip title="Exit fullscreen">
                        <IconButton
                            size="lg"
                            aria-label="Exit fullscreen"
                            sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
                            onClick={() => setFullScreen(undefined)}>
                            <Minimize />
                        </IconButton>
                    </Tooltip>
                )}
            </QueryClientProvider>
        </AuthWrapper>
    );
}
