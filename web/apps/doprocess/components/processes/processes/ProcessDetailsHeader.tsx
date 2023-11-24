'use client';

import { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { Row } from '@signalco/ui-primitives/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Delete, Embed, ListChecks, MoreHorizontal, Play } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { ListHeader } from '../../shared/ListHeader';
import { EmbedModal } from '../../shared/EmbedModal';
import { KnownPages } from '../../../src/knownPages';
import { useProcess } from '../../../src/hooks/useProcess';
import { TypographyProcessRunName } from './TypographyProcessRunName';
import { TypographyProcessName } from './TypographyProcessName';
import { RunProgress } from './RunProgress';
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
            <Stack spacing={1}>
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
                {runId && (
                    <Row spacing={1} className="self-end">
                        <Typography level="body3">Progress:</Typography>
                        <RunProgress processId={processId} runId={runId} />
                    </Row>
                )}
            </Stack>
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
