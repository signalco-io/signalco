'use client';
import { useState } from 'react';
import { cx } from 'classix';
import { Delete, ListChecks, MoreHorizontal, Play } from '@signalco/ui-icons';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ListHeader } from '../shared/ListHeader';
import { KnownPages } from '../../src/knownPages';
import { useProcess } from '../../src/hooks/useProcess';
import { TypographyProcessRunName } from './TypographyProcessRunName';
import { TypographyProcessName } from './TypographyProcessName';
import { ProcessRunCreateModal } from './ProcessRunCreateModal';
import { ProcessOrRunDeleteModal } from './ProcessOrRunDeleteModal';

export function ProcessDetailsHeader({
    processId, runId, editable
}: {
    processId: string;
    runId?: string;
    editable: boolean;
}) {
    const { data: process, isLoading: isLoadingProcess, error: errorProcess } = useProcess(processId);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const isRun = Boolean(runId);

    return (
        <Loadable
            isLoading={isLoadingProcess}
            loadingLabel="Loading process details..."
            placeholder={<Skeleton className="h-7 w-[120px]" />}
            error={errorProcess}>
            <ListHeader
                icon={isRun ? <Play /> : <ListChecks />}
                header={isRun
                    ? (<TypographyProcessRunName id={processId} runId={runId} level="h5" editable={editable} noWrap />)
                    : (<TypographyProcessName id={processId} level="h5" editable={editable} noWrap />)}
                actions={[
                    (process && editable && !isRun) && <ProcessRunCreateModal process={process} />,
                    (editable) && (
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
                                {!isRun && (
                                    <>
                                        <DropdownMenuItem startDecorator={<Play />} href={KnownPages.ProcessRuns(processId)}>
                                            View process runs
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteOpen(true)}>
                                    Delete...
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                ]} />
            <ProcessOrRunDeleteModal
                processId={processId}
                runId={runId}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                redirect={runId ? KnownPages.ProcessRuns(processId) : KnownPages.Processes} />
        </Loadable>
    );
}
