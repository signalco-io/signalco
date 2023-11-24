import { PropsWithChildren } from 'react';
import { AppProviders } from '../../../components/providers/AppProviders';
import { PageNav } from '../../../components/PageNav';
import { AppLayout } from '../../../components/layouts/AppLayout';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <PageNav fullWidth />
            <div className="pt-16 md:h-full">
                <AppProviders>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </AppProviders>
            </div>
        </>
    );
}
