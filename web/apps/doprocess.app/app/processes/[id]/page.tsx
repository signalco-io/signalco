import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Add, Play } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { createTaskDefinition, getProcess, getTaskDefinitions, runProcess } from '../../../src/lib/repo/processesRepository';
import TaskList from '../../../components/TaskList';
import { TaskDetails } from '../../../components/TaskDetails';
import { SplitView } from '../../../components/layouts/SplitView';

function AddTaskDefinitionButton({ processId }: { processId: number }) {
    const createTaskDefinitionFormAction = async () => {
        'use server';

        await createTaskDefinition(processId, '', '');
        revalidatePath(`/processes/${processId}`);
    }

    return (
        <div className="flex flex-col items-center">
            <form action={createTaskDefinitionFormAction}>
                <IconButton type="submit">
                    <Add />
                </IconButton>
            </form>
        </div>
    );
}

async function ProcessDetails({id}: {id: number}) {
    const process = await getProcess(id);
    if (process == null)
        throw new Error('Process not found');

    const taskDefinitions = await getTaskDefinitions(process?.id);

    const runProcessFormAction = async () => {
        'use server';

        const runId = await runProcess(id);
        redirect(`/processes/${id}/runs/${runId}`);
    }

    return (
        <Stack className="p-2" spacing={2}>
            <Row spacing={1} justifyContent="space-between">
                <Typography level="h5">Process {process.name}</Typography>
                <Tooltip title="Run process">
                    <form action={runProcessFormAction}>
                        <IconButton>
                            <Play />
                        </IconButton>
                    </form>
                </Tooltip>
            </Row>
            <TaskList tasks={taskDefinitions.map(td => ({ taskDefinition: td }))} />
            <AddTaskDefinitionButton processId={process.id} />
        </Stack>
    );
}

export default function ProcessPage({ params }: {params: { id: string }}) {
    return (
        <SplitView>
            <ProcessDetails id={parseInt(params.id, 10) || 0} />
            <TaskDetails />
        </SplitView>
    );
}
