import { PropsWithChildren } from 'react';
import { PageLayout } from '../../components/layouts/PageLayout';

export default function RestLayout({ children }: PropsWithChildren) {
    return <PageLayout>{children}</PageLayout>;
}
