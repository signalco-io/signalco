import { Stack } from '@signalco/ui-primitives/Stack';
import { ListHeader } from '@signalco/ui-primitives/List';
import { ProcessesList } from './ProcessesList';

export function ProcessesListView() {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header="Processes" />
            <ProcessesList />
        </Stack>
    );
}
