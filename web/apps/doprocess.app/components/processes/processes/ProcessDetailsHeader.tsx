'use client';

import { useState } from 'react';
import { cx } from '@signalco/ui/cx';
import { Delete, Embed, ListChecks, MoreHorizontal, Play } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/Stack';
import { Skeleton } from '@signalco/ui/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui/Menu';
import { Loadable } from '@signalco/ui/Loadable';
import { IconButton } from '@signalco/ui/IconButton';
import { ListHeader } from '../../shared/ListHeader';
import { EmbedModal } from '../../shared/EmbedModal';
import { KnownPages } from '../../../src/knownPages';
import { useProcess } from '../../../src/hooks/useProcess';
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
    const [embedOpen, setEmbedOpen] = useState(false);

    const isRun = Boolean(runId);

    return (
        <Loadable
            isLoading={isLoadingProcess}
            loadingLabel="Loading process details..."
            placeholder={<Skeleton className="h-7 w-[120px]" />}
            error={errorProcess}>
            <Stack>
                Stack
            </Stack>
            <ListHeader
                icon={isRun ? <Play /> : <ListChecks />}
                header={isRun
                    ? (<TypographyProcessRunName id={processId} runId={runId} level="h5" editable={editable} noWrap />)
                    : (<TypographyProcessName id={processId} level="h5" editable={editable} noWrap />)}
                actions={[
                    (process && editable && !isRun) && <ProcessRunCreateModal processId={processId} />,
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
                                <DropdownMenuItem startDecorator={<Embed />} onClick={() => setEmbedOpen(true)}>
                                    Embed...
                                </DropdownMenuItem>
                                {!isRun && (
                                    <DropdownMenuItem startDecorator={<Play />} href={KnownPages.ProcessRuns(processId)}>
                                        View process runs
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
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
            <EmbedModal
                header={runId ? 'Embed process run' : 'Embed process'}
                subHeader={runId
                    ? 'To embed this process run, copy the following HTML snippet and paste it into your website:'
                    : 'To embed this process, copy the following HTML snippet and paste it into your website:'}
                src={`https://doprocess.app${runId ? KnownPages.ProcessRun(processId, runId) : KnownPages.Process(processId)}/embedded`}
                open={embedOpen}
                onOpenChange={setEmbedOpen} />
        </Loadable>
    );
}
