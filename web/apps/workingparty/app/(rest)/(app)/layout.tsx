import { PropsWithChildren } from 'react';
import { AuthProtectedSection } from '@signalco/auth-client/components';
import { KnownPages } from '../../../src/knownPages';
import { AppClientProvider } from '../../../src/components/providers/AppClientProvider';
import { AuthAppProvider } from '../../../src/components/providers/AppAuthProvider';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <AppClientProvider>
            <AuthAppProvider>
                <AuthProtectedSection mode="redirect" redirectUrl={KnownPages.Login}>
                    <div className="md:h-full">
                        {children}
                    </div>
                </AuthProtectedSection>
            </AuthAppProvider>
        </AppClientProvider>
    );
}
