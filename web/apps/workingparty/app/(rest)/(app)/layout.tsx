import { PropsWithChildren } from 'react';
import { AppClientProvider } from '../../../src/components/providers/AppClientProvider';
import { AuthSection } from '../../../src/components/auth/AuthSection';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <AppClientProvider>
            <AuthSection>
                <div className="md:h-full">
                    {children}
                </div>
            </AuthSection>
        </AppClientProvider>
    );
}
