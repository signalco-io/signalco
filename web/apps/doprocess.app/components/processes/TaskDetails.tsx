'use client';

import dynamic from 'next/dynamic';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { useProcessTaskDefinition } from './useProcessTaskDefinition';
import { EditorSkeleton } from './editor/EditorSkeleton';

const Editor = dynamic(() => import('./editor/Editor').then(mod => mod.Editor), { ssr: false, loading: () => <EditorSkeleton /> });

export function TaskDetails({ processId }: { processId: string }) {
    const [selectedTaskId] = useSearchParam('task');
    const { data: taskDefinition, isLoading: taskDefinitionIsLoading, error: taskDefinitionError } = useProcessTaskDefinition(processId, selectedTaskId);

    if (typeof selectedTaskId === 'undefined') {
        return (
            <div className="flex items-center justify-center text-xl text-muted-foreground">
                No task selected.
            </div>
        );
    }

    const hasHeader = (taskDefinition?.text?.length ?? 0) > 0;

    return (
        <Loadable
            isLoading={taskDefinitionIsLoading}
            loadingLabel="Loading document..."
            error={taskDefinitionError}
            placeholder={(
                <Stack spacing={2}>
                    <Skeleton className="mx-[62px] h-12 w-[250px]" />
                    <EditorSkeleton />
                </Stack>
            )}>
            <Stack spacing={2}>
                <Typography level="h2" className={cx('px-[62px]', !hasHeader && 'text-muted-foreground hover:text-foreground')}>
                    {hasHeader ? taskDefinition?.text : 'No description'}
                </Typography>
                <Editor />
            </Stack>
        </Loadable>
    );
}
