import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes'

export function RootClientProvider({ children }: PropsWithChildren) {
    return (
        <ThemeProvider attribute="class">
            {children}
        </ThemeProvider>
    );
}