import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Add, Navigate } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Popper } from '@signalco/ui/dist/Popper';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { List } from '@signalco/ui/dist/List';
import { Input } from '@signalco/ui/dist/Input';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Button } from '@signalco/ui/dist/Button';
import { createProcess, getProcesses } from '../../src/lib/repo/processesRepository';
import { KnownPages } from '../../src/knownPages';
import { SplitView } from '../../components/layouts/SplitView';

function CreateProcessForm() {
    const createProcessFormAction = async (data: FormData) => {
        'use server';

        const name = data.get('name')?.toString();
        if (name == null)
            throw new Error('Missing name');

        const createdId = createProcess(name);
        revalidatePath('/processes');
        redirect(`/processes/${createdId}`);
    }

    return (
        <form action={createProcessFormAction}>
            <Stack spacing={2}>
                <Input name="name" label="Name" placeholder="example: Onboarding process"/>
                <Tooltip title="Create tempalte">
                    <Button type="submit" variant="soft" startDecorator={<Add />} className="self-end">
                        Create
                    </Button>
                </Tooltip>
            </Stack>
        </form>
    )
}

async function ProcessesList() {
    const processes = await getProcesses();

    return (
        <List>
            {!processes.length && <NoDataPlaceholder className="text-center">No processes. Start by creating new process.</NoDataPlaceholder>}
            {processes.map((process) => (
                <ListItem
                    key={process.id}
                    label={process.name}
                    endDecorator={<Navigate className="opacity-0 group-hover:opacity-100" />}
                    className="group w-full"
                    href={KnownPages.Process(process.id)} />
            ))}
        </List>
    );
}

function ProcessesListView() {
    return (
        <Stack className="p-2" spacing={2}>
            <Row spacing={2} justifyContent="space-between">
                <Typography level="h5">Processes</Typography>
                <Popper
                    trigger={(
                        <IconButton title="Create process">
                            <Add />
                        </IconButton>
                    )}>
                    <div className="p-4">
                        <CreateProcessForm />
                    </div>
                </Popper>
            </Row>
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
