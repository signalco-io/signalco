'use client';

import dynamic from 'next/dynamic';
import { cx } from 'classix';
import { TypographyEditable } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { EditorSkeleton } from '../editor/EditorSkeleton';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import { TaskDetailsToolbar } from './TaskDetailsToolbar';

const Editor = dynamic(() => import('../editor/Editor').then(mod => mod.Editor), { ssr: false, loading: () => <EditorSkeleton /> });

type TaskDetailsProps = {
    processId: string;
    editable: boolean;
};

export function TaskDetails({ processId, editable }: TaskDetailsProps) {
    const [selectedTaskId] = useSearchParam('task');
    const { data: taskDefinition, isLoading: taskDefinitionIsLoading, error: taskDefinitionError } = useProcessTaskDefinition(processId, selectedTaskId);

    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();
    const handleHeaderChange = async (text: string) => {
        if (selectedTaskId) {
            await taskDefinitionUpdate.mutateAsync({
                processId,
                taskDefinitionId: selectedTaskId,
                text
            });
        }
    }
    const headerMutatedOrDefault = (taskDefinitionUpdate.variables?.text ?? taskDefinition?.text) ?? '';
    const hasHeader = headerMutatedOrDefault.length > 0;
    const header = hasHeader ? headerMutatedOrDefault : 'No description';

    if (taskDefinition === null && !taskDefinitionIsLoading) {
        return (
            <div className="flex items-center justify-center text-xl text-muted-foreground">
                Task not found.
            </div>
        );
    }

    return (
        <Stack spacing={2} className="overflow-x-hidden">
            {editable && <TaskDetailsToolbar processId={processId} selectedTaskId={selectedTaskId} />}
            {selectedTaskId === undefined && (
                <div className="flex items-center justify-center text-xl text-muted-foreground">
                    No task selected.
                </div>
            )}
            {(taskDefinition === null && !taskDefinitionIsLoading) && (
                <div className="flex items-center justify-center text-xl text-muted-foreground">
                    Task not found.
                </div>
            )}
            {selectedTaskId && (
                <Loadable
                    isLoading={taskDefinitionIsLoading}
                    loadingLabel="Loading document..."
                    error={taskDefinitionError}
                    placeholder={(
                        <>
                            <Skeleton className="mx-[62px] h-12 w-[250px]" />
                            <EditorSkeleton />
                        </>
                    )}>
                    <div className="px-[62px]">
                        {editable ? (
                            <TypographyEditable
                                level="h2"
                                className={cx(!hasHeader && 'text-muted-foreground hover:text-foreground')}
                                onChange={handleHeaderChange}>
                                {header}
                            </TypographyEditable>
                        ) : (
                            <Typography level="h2">{header}</Typography>
                        )}
                    </div>
                    <Editor editable={editable} />
                </Loadable>
            )}
        </Stack>
    );
}
