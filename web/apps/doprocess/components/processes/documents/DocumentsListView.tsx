import { Stack } from '@signalco/ui-primitives/Stack';
import { ListHeader } from '@signalco/ui-primitives/List';
import { DocumentsList } from './DocumentsList';

export function DocumentsListView() {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header="Documents" />
            <DocumentsList />
        </Stack>
    );
}
