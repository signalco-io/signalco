import { PropsWithChildren } from 'react';
import { PageLayout } from '../../components/layouts/PageLayout';

export default function LandingLayoutPage({ children }: PropsWithChildren) {
    return (
        <PageLayout>
            {children}
        </PageLayout>
    );
}