'use client';

import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Stack } from '@signalco/ui-primitives/Stack';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Minimize } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { PageTitle } from '../navigation/titles/PageTitle';
import NavProfile from '../navigation/NavProfile';
import { AuthWrapper } from './AuthWrapper';
import { AppClientWrapper } from './AppClientWrapper';


export function AppLayout(props: React.PropsWithChildren) {
    const {
        children
    } = props;
    const [isFullScreen, setFullScreen] = useSearchParam('fullscreen');

    return (
        <AuthWrapper>
            <AppClientWrapper>
                <div className="flex w-full flex-col sm:flex-row">
                    {isFullScreen !== 'true' && (
                        <NavProfile />
                    )}
                    <div className={cx(
                        'relative w-full grow overflow-hidden',
                        isFullScreen ? '' : 'mt-[70px] sm:ml-[82px] sm:mt-0'
                    )}>
                        <Stack>
                            <div className="hidden p-2 sm:block">
                                <PageTitle fullPage />
                            </div>
                            {children}
                        </Stack>
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
            </AppClientWrapper>
        </AuthWrapper>
    );
}
