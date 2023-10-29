import { Add } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Popper } from '@signalco/ui/dist/Popper';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ProcessesList } from '../../components/processes/ProcessesList';
import { CreateProcessForm } from '../../components/processes/CreateProcessForm';
import { SplitView } from '../../components/layouts/SplitView';
import { ListHeader } from '../../components/layouts/ListHeader';

function ProcessesListView() {
    return (
        <Stack className="p-2" spacing={2}>
            <ListHeader
                header="Processes"
                actions={[
                    <Popper
                        key="create-process"
                        trigger={(
                            <IconButton title="Create process">
                                <Add />
                            </IconButton>
                        )}>
                        <div className="p-4">
                            <CreateProcessForm redirect />
                        </div>
                    </Popper>
                ]}
            />
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
