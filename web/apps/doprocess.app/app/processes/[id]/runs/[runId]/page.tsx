import dynamic from 'next/dynamic';
import { Stack } from '@signalco/ui/dist/Stack';
import { getTaskDefinitions, getTasks } from '../../../../../src/lib/repo/processesRepository';
import { SplitView } from '../../../../../components/layouts/SplitView';

const TaskList = dynamic(() => import('../../../../../components/TaskList'), { ssr: false });

export default async function ProcessRunPage({ params }: {params: { id: string, runId: string }}) {
    const processId = parseInt(params.id, 10) || 0;
    const runId = parseInt(params.runId, 10) || 0;

    const tasks = await getTasks(processId, runId);
    const taskDefinitions = await getTaskDefinitions(processId);
    const listTasks = tasks
        .filter(task => taskDefinitions.find(td => td.id === task.taskDefinitionId) != null)
        .map((task) => ({
            taskDefinition: taskDefinitions.find(td => td.id === task.taskDefinitionId)!,
            task
        }));

    return (
        <SplitView>
            <Stack>
                <TaskList tasks={listTasks} />
            </Stack>
        </SplitView>
    );
}
