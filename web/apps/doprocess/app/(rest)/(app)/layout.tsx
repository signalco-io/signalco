import { PropsWithChildren } from 'react';
import { AppProviders } from '../../../components/providers/AppProviders';
import { AppLayout } from '../../../components/layouts/AppLayout';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="md:h-full">
                <AppProviders>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </AppProviders>
            </div>
        </>
    );
}
