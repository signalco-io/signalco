'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from 'next-themes'
import { NotificationsContainer } from '@signalco/ui-notifications';
import useAppTheme from '../src/hooks/useAppTheme';

function ThemeChangerWrapper({ children }: PropsWithChildren) {
    const { resolvedTheme } = useTheme();
    useAppTheme();
    return (
        <>
            <NotificationsContainer theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
            {children}
        </>
    );
}

export function LayoutClientWrapper({ children }: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            <ThemeChangerWrapper>
                {children}
            </ThemeChangerWrapper>
        </ThemeProvider>
    )
}
