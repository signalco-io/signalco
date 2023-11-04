import { Stack } from '@signalco/ui/dist/Stack';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { ListHeader } from '../layouts/ListHeader';

export function RunsListView() {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header="Runs" />
            <NoDataPlaceholder>Coming soon</NoDataPlaceholder>
        </Stack>
    );
}
