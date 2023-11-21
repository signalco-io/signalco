'use client';

import { Typography } from '@signalco/ui/Typography';
import { Stack } from '@signalco/ui/Stack';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { ListHeader } from '../../shared/ListHeader';
import { TypographyProcessName } from './TypographyProcessName';
import { RunsList } from './RunsList';

export function RunsListView({ processId }: { processId?: string }) {
    const [searchParamProcessId] = useSearchParam('process-id');
    const actualProcessId = processId ?? searchParamProcessId;

    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header={(
                <>
                    {actualProcessId && <TypographyProcessName id={actualProcessId} level="h5" />}
                    <Typography level="h5">{actualProcessId ? 'runs' : 'Runs'}</Typography>
                </>
            )} />
            <RunsList processId={actualProcessId} />
        </Stack>
    );
}
