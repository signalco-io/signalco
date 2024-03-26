'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { ListHeader } from '@signalco/ui-primitives/List';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Filter } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { TypographyProcessName } from './TypographyProcessName';
import { RunsList } from './RunsList';

export function RunsListView({ processId }: { processId?: string }) {
    const [searchParamProcessId] = useSearchParam('process-id');
    const [showCompleted, setShowCompleted] = useSearchParam('show-completed');
    const actualProcessId = processId ?? searchParamProcessId;

    const isShowCompleted = showCompleted === 'true';

    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader
                header={(
                    <>
                        {actualProcessId && <TypographyProcessName id={actualProcessId} level="h5" />}
                        <Typography level="h5">{actualProcessId ? 'runs' : 'Runs'}</Typography>
                    </>
                )}
                actions={[(
                    <DropdownMenu key="filter-actions">
                        <DropdownMenuTrigger asChild>
                            <IconButton variant="plain">
                                <Filter className={cx(isShowCompleted && 'fill-primary')} />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setShowCompleted(isShowCompleted ? undefined : 'true')}
                                className="flex items-center">
                                {isShowCompleted ? 'Hide completed' : 'Show completed'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )]} />
            <RunsList processId={actualProcessId} />
        </Stack>
    );
}
