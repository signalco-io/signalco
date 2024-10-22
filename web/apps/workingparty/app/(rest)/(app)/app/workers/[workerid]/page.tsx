'use client';

import { redirect, useParams } from 'next/navigation';
import { KnownPages } from '../../../../../../src/knownPages';
import { useWorkerThreads } from '../../../../../../src/hooks/data/workers/useWorkerThreads'

export default function WorkerPage() {
    const params = useParams<{ workerid: string }>();
    const { workerid } = params;
    const threads = useWorkerThreads(workerid);

    const firstThreadId = threads.data ? threads.data[0]?.id : null;
    if (threads.isLoading || threads.isPending || !firstThreadId) {
        return null;
    }

    redirect(KnownPages.AppWorkerThread(workerid, firstThreadId));
}
