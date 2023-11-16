'use client';

import { useState } from 'react';
import { cx } from 'classix';
import { Delete, ListChecks, MoreHorizontal, Play } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ListHeader } from '../shared/ListHeader';
import { KnownPages } from '../../src/knownPages';
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
    const { data: process, isLoading: isLoadingProcess, error: errorProcess } = useProcess(id);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const isRun = Boolean(runId);

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
                    isLoading={isLoadingProcess}
                    loadingLabel="Loading process details..."
                    placeholder={<Skeleton className="h-7 w-[120px]" />}
                    error={errorProcess}>
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
                <TaskList
                    processId={id}
                    runId={runId}
                    editable={editable} />
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
