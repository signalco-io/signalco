import { ReactNode } from 'react';
import { PageLayout } from '../layout';

export default function RootContentLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            {children}
        </PageLayout>
    );
}