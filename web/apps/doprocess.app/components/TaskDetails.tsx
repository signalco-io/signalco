'use client';

import dynamic from 'next/dynamic';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { useProcessTaskDefinition } from './processes/useProcessTaskDefinition';

const Editor = dynamic(() => import('./processes/editor/Editor').then(mod => mod.Editor), {ssr: false});

export function TaskDetails({ processId }: { processId: string }) {
    const [selectedTaskId] = useSearchParam('task');
    const {data: taskDefinition} = useProcessTaskDefinition(processId, selectedTaskId);

    if (typeof selectedTaskId === 'undefined') {
        return (
            <div className="flex items-center justify-center text-xl text-muted-foreground">
                No task selected.
            </div>
        );
    }

    return (
        <Stack spacing={2}>
            <Typography level="h2">{taskDefinition?.text ?? ''}</Typography>
            <Editor />
        </Stack>
    );
}
