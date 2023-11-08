import { Stack } from '@signalco/ui/dist/Stack';
import { ListHeader } from '../../layouts/ListHeader';
import { DocumentsList } from './DocumentsList';

export function DocumentsListView() {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header="Documents" />
            <DocumentsList />
        </Stack>
    );
}
