'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes'
import useAppTheme from '../src/hooks/useAppTheme';

function ThemeChangerWrapper({ children }: PropsWithChildren) {
    useAppTheme();
    return <>{children}</>;
}

export function LayoutClientWrapper({ children }: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            <ThemeChangerWrapper>
                <NotificationsContainer />
                {children}
            </ThemeChangerWrapper>
        </ThemeProvider>
    )
}
