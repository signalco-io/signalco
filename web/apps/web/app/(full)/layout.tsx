import { ReactNode } from 'react';
import { PageLayout } from '../layout';

export default function RootFullLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout fullWidth>
            {children}
        </PageLayout>
    );
}