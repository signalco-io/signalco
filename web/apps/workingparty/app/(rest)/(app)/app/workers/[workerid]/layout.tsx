import { PropsWithChildren } from 'react';
import { WorkerLayoutClient } from './LayoutClient';

export default async function WorkerLayout({ children, params }: PropsWithChildren & LayoutProps<'/app/workers/[workerid]'>) {
    const { workerid } = await params;
    return <WorkerLayoutClient params={{ workerid }}>{children}</WorkerLayoutClient>;
}
