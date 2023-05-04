'use client';

import { ToastContainer } from 'react-toastify';
import { PropsWithChildren } from 'react';
import useAppTheme from '../src/hooks/useAppTheme';

function ThemeChangerWrapper({ children }: PropsWithChildren) {
    useAppTheme();
    return <>{children}</>;
}

export function LayoutClientWrapper({ children }: PropsWithChildren) {
    return (
        <>
            <ThemeChangerWrapper>
                <ToastContainer />
                {children}
            </ThemeChangerWrapper>
        </>
    )
}
