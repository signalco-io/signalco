import { Stack } from '@signalco/ui/dist/Stack';
import { ListHeader } from '../layouts/ListHeader';
import { RunsList } from './RunsList';

export function RunsListView({ processId }: { processId?: string }) {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header="Runs" />
            <RunsList processId={processId} />
        </Stack>
    );
}
