'use client';

import { useMemo, useState } from 'react';
import { cx } from 'classix';
import { Delete, ListChecks, MoreHorizontal, Play } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ListSkeleton } from '../shared/ListSkeleton';
import { ListHeader } from '../shared/ListHeader';
import { KnownPages } from '../../src/knownPages';
import { useProcessTaskDefinitions } from '../../src/hooks/useProcessTaskDefinitions';
import { useProcessRunTasks } from '../../src/hooks/useProcessRunTasks';
import { useProcess } from '../../src/hooks/useProcess';
import { TypographyProcessRunName } from './TypographyProcessRunName';
import { TypographyProcessName } from './TypographyProcessName';
import { TaskList } from './tasks/TaskList';
import { ProcessRunCreateModal } from './ProcessRunCreateModal';
import { ProecssDeleteModal } from './ProcessDeleteModal';

type ProcessDetailsProps = {
    id: string;
    runId?: string;
    editable: boolean;
};

export function ProcessDetails({ id, runId, editable }: ProcessDetailsProps) {
    const { data: process } = useProcess(id);
    const { data: taskDefinitions, isLoading: isLoadingTaskDefinitions, error: errorTaskDefinitions } = useProcessTaskDefinitions(id);
    const { data: tasks, isLoading: isLoadingTasks, error: errorTasks } = useProcessRunTasks(id, runId);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const isRun = Boolean(runId);

    const taskListItems = useMemo(() =>
        taskDefinitions?.map(td => ({
            taskDefinition: td,
            task: tasks?.find(t => t.taskDefinitionId === td.id)
        })) ?? [],
    [taskDefinitions, tasks]);

    if (process === null) {
        return (
            <div className="opacity-60">
                <p className="text-2xl font-semibold">{isRun ? 'Process run' : 'Process'} not found</p>
                <p className="text-sm">The {isRun ? 'process run' : 'process'} you are trying to access does not exist.</p>
            </div>
        );
    }

    return (
        <>
            <Stack spacing={2}>
                <Loadable
                    isLoading={isLoadingTaskDefinitions}
                    loadingLabel="Loading process details..."
                    placeholder={<Skeleton className="h-7 w-[120px]" />}>
                    <ListHeader
                        icon={isRun ? <Play /> : <ListChecks />}
                        header={
                            isRun
                                ? (<TypographyProcessRunName id={id} runId={runId} level="h5" editable={editable} noWrap />)
                                : (<TypographyProcessName id={id} level="h5" editable={editable} noWrap />)
                        }
                        actions={[
                            (process && editable && !isRun) && <ProcessRunCreateModal process={process} />,
                            (editable && !isRun) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        asChild
                                        className={cx('transition-opacity opacity-0', process && 'opacity-100')}>
                                        <IconButton
                                            variant="plain"
                                            title="Task options...">
                                            <MoreHorizontal />
                                        </IconButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem startDecorator={<Play />} href={KnownPages.ProcessRuns(id)}>
                                            View process runs
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteOpen(true)}>
                                            Delete...
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        ]} />
                </Loadable>
                <Loadable
                    isLoading={isLoadingTaskDefinitions || isLoadingTasks}
                    loadingLabel="Loading task definitions..."
                    placeholder={<ListSkeleton itemClassName="h-9 w-full" />}
                    error={errorTaskDefinitions || errorTasks}>
                    <TaskList
                        processId={id}
                        runId={runId}
                        tasks={taskListItems}
                        editable={editable} />
                </Loadable>
            </Stack>
            {process && (
                <ProecssDeleteModal
                    process={process}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    redirect={KnownPages.Processes} />
            )}
        </>
    );
}
