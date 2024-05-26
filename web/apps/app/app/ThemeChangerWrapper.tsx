'use client';

import { PropsWithChildren } from 'react';
import { useTheme } from 'next-themes';
import { NotificationsContainer } from '@signalco/ui-notifications';
import useAppTheme from '../src/hooks/useAppTheme';

export function ThemeChangerWrapper({ children }: PropsWithChildren) {
    const { resolvedTheme } = useTheme();
    useAppTheme();
    return (
        <>
            <NotificationsContainer theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
            {children}
        </>
    );
}
