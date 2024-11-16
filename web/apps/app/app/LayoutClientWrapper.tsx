import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes'
import { ThemeChangerWrapper } from './ThemeChangerWrapper';

export function LayoutClientWrapper({ children }: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            <ThemeChangerWrapper>
                {children}
            </ThemeChangerWrapper>
        </ThemeProvider>
    )
}
