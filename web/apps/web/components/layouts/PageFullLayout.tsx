import { PropsWithChildren } from 'react';
import { PageLayout } from './PageLayout';

export function PageFullLayout(props: PropsWithChildren) {
    return <PageLayout fullWidth {...props} />;
}
