'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cx } from 'classix';
import { Delete, MoreHorizontal } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { Row } from '@signalco/ui/dist/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { useProcessTaskDefinition } from './useProcessTaskDefinition';
import { TaskDeleteModal } from './TaskDeleteModal';
import { EditorSkeleton } from './editor/EditorSkeleton';

const Editor = dynamic(() => import('./editor/Editor').then(mod => mod.Editor), { ssr: false, loading: () => <EditorSkeleton /> });

type TaskDetailsProps = {
    processId: string;
    editable: boolean;
};

function TaskDetailsToolbar({ processId, selectedTaskId }: { processId: string, selectedTaskId: string | undefined }) {
    const { data: taskDefinition } = useProcessTaskDefinition(processId, selectedTaskId);
    const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);

    return (
        <>
            <Row className="p-2">
                <div className="grow"></div>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className={cx('transition-opacity opacity-0', taskDefinition && 'opacity-100')}>
                        <IconButton
                            variant="plain"
                            title="Task options...">
                            <MoreHorizontal />
                        </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteTaskOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Row>
            {taskDefinition && (
                <TaskDeleteModal
                    taskDefinition={taskDefinition}
                    open={deleteTaskOpen}
                    onOpenChange={setDeleteTaskOpen}
                />
            )}
        </>
    );
}

export function TaskDetails({ processId, editable }: TaskDetailsProps) {
    const [selectedTaskId] = useSearchParam('task');
    const { data: taskDefinition, isLoading: taskDefinitionIsLoading, error: taskDefinitionError } = useProcessTaskDefinition(processId, selectedTaskId);

    if (taskDefinition === null && !taskDefinitionIsLoading) {
        return (
            <div className="flex items-center justify-center text-xl text-muted-foreground">
                Task not found.
            </div>
        );
    }

    const hasHeader = (taskDefinition?.text?.length ?? 0) > 0;

    return (
        <Stack spacing={2}>
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
                    <Typography level="h2" className={cx('px-[62px]', !hasHeader && 'text-muted-foreground hover:text-foreground')}>
                        {hasHeader ? taskDefinition?.text : 'No description'}
                    </Typography>
                    <Editor editable={editable} />
                </Loadable>
            )}
        </Stack>
    );
}
