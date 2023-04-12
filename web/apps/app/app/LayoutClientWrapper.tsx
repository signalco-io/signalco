'use client';

import { ToastContainer } from 'react-toastify';
import { ChildrenProps, CssBaseline, CssVarsProvider, buildSignalcoTheme, getInitColorSchemeScript } from '@signalco/ui';
import useAppTheme from '../src/hooks/useAppTheme';

const signalcoTheme = buildSignalcoTheme();

function ThemeChangerWrapper({children}: ChildrenProps) {
    useAppTheme();
    return <>{children}</>;
}

export function LayoutClientWrapper({children}: ChildrenProps) {
    return (
        <>
            {getInitColorSchemeScript()}
            <CssVarsProvider theme={signalcoTheme}>
                <CssBaseline />
                <ThemeChangerWrapper>
                    <ToastContainer />
                    {children}
                </ThemeChangerWrapper>
            </CssVarsProvider>
        </>
    )
}
