'use client';

import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Link } from '@signalco/ui/dist/Link';
import { KnownPages } from '../../../../../../src/knownPages';
import { useProcessTaskDefinitions } from '../../../../../../components/processes/useProcessTaskDefinitions';
import { useProcessRunTasks } from '../../../../../../components/processes/useProcessRunTasks';
import { useProcessRun } from '../../../../../../components/processes/useProcessRun';
import { useProcess } from '../../../../../../components/processes/useProcess';
import TaskList from '../../../../../../components/processes/TaskList';
import { SplitView } from '../../../../../../components/layouts/SplitView';
import { ListHeader } from '../../../../../../components/layouts/ListHeader';

function ProcessRunHeader({ id, runId }: { id: string, runId: string }) {
    const { data: process } = useProcess(id);
    const { data: run } = useProcessRun(id, runId);

    return (
        <ListHeader
            header={run?.name}
            description={(
                <Typography>Based on process: <Link href={KnownPages.Process(id)}>{process?.name}</Link></Typography>
            )} />
    );
}

export default function ProcessRunPage({ params }: { params: { id: string, runId: string } }) {
    const { id, runId } = params;
    const { data: tasks } = useProcessRunTasks(id, runId);
    const { data: taskDefinitions } = useProcessTaskDefinitions(id);
    const listTasks = tasks
        ?.filter(task => taskDefinitions?.find(td => td.id === task.taskDefinitionId) != null)
        .map((task) => ({
            taskDefinition: taskDefinitions!.find(td => td.id === task.taskDefinitionId)!,
            task
        }));

    return (
        <SplitView>
            <Stack className="p-2" spacing={2}>
                <ProcessRunHeader id={id} runId={runId} />
                <TaskList processId={id} tasks={listTasks ?? []} editable={false} />
            </Stack>
        </SplitView>
    );
}
