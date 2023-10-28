'use client';

import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';

export function TaskDetails() {
    const [selectedTaskId] = useSearchParam('task');

    return (
        <div>
            Task Details {selectedTaskId}
        </div>
    );
}
