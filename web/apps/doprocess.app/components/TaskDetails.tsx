'use client';

import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';

export function TaskDetails() {
    const [selectedTaskId] = useSearchParam('task');

    if (typeof selectedTaskId === 'undefined') {
        return (
            <div className="flex items-center justify-center text-xl text-muted-foreground">
                No task selected.
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center text-xl text-muted-foreground">
            No additional instructions yet.
        </div>
    );
}
