import { Stack } from '@signalco/ui/dist/Stack';
import { ProcessesList } from '../../../components/processes/ProcessesList';
import { SplitView } from '../../../components/layouts/SplitView';
import { ListHeader } from '../../../components/layouts/ListHeader';

function ProcessesListView() {
    return (
        <Stack className="p-2" spacing={2}>
            <ListHeader header="Processes" />
            <ProcessesList />
        </Stack>
    );
}

export default function ProcessesPage() {
    return (
        <SplitView>
            <ProcessesListView />
        </SplitView>
    )
}
