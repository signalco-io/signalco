'use client';

import { Play } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/Typography';
import { Stack } from '@signalco/ui/Stack';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { List } from '../../shared/List';
import { KnownPages } from '../../../src/knownPages';
import { useProcessRuns } from '../../../src/hooks/useProcessRuns';
import { useProcessesRuns } from '../../../src/hooks/useProcessesRuns';
import { RunsListItem } from './RunsListItem';
import { ProcessRunCreateForm } from './ProcessRunCreateForm';

function RunsListEmptyPlaceholder() {
    return (
        <Stack spacing={4} alignItems="center" className="px-4 py-12 text-center sm:py-24 md:py-40 lg:py-60">
            <Play size={64} className="opacity-60" />
            <Stack spacing={2}>
                <Typography level="h4" secondary>No runs</Typography>
                <Typography secondary>You do not have any process runs yet. You can start by creating a process.</Typography>
            </Stack>
            <NavigatingButton href={KnownPages.Processes}>Processes</NavigatingButton>
        </Stack>
    );
}

export function RunsList({ processId }: { processId?: string }) {
    const processRuns = useProcessRuns(processId);
    const processesRuns = useProcessesRuns(!processId);

    return (
        <List
            query={() => processId ? processRuns : processesRuns}
            itemRender={(item) => (<RunsListItem run={item} />)}
            editable={Boolean(processId)}
            itemCreateLabel="New process run"
            createForm={processId ? <ProcessRunCreateForm processId={processId} redirect /> : undefined}
            emptyPlaceholder={<RunsListEmptyPlaceholder />}
        />
    );
}
