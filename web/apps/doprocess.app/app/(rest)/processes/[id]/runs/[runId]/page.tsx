'use client';

import { Stack } from '@signalco/ui/dist/Stack';
import { Breadcrumbs } from '@signalco/ui/dist/Breadcrumbs';
import { KnownPages } from '../../../../../../src/knownPages';
import { useProcessTaskDefinitions } from '../../../../../../components/processes/useProcessTaskDefinitions';
import { useProcessRunTasks } from '../../../../../../components/processes/useProcessRunTasks';
import { useProcessRun } from '../../../../../../components/processes/useProcessRun';
import { TypographyProcessName } from '../../../../../../components/processes/TypographyProcessName';
import TaskList from '../../../../../../components/processes/TaskList';
import { TaskDetails } from '../../../../../../components/processes/TaskDetails';
import { SplitView } from '../../../../../../components/layouts/SplitView';
import { ListHeader } from '../../../../../../components/layouts/ListHeader';

function ProcessRunHeader({ id, runId }: { id: string, runId: string }) {
    const { data: run } = useProcessRun(id, runId);

    return (
        <Stack>
            <Breadcrumbs
                endSeparator
                items={[
                    { label: 'Processes', href: KnownPages.Processes },
                    { label: <TypographyProcessName id={id} />, href: KnownPages.Process(id) },
                ]} />
            <ListHeader header={run?.name} />
        </Stack>
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
            <div className="py-10">
                <TaskDetails processId={id} editable={false} />
            </div>
        </SplitView>
    );
}
