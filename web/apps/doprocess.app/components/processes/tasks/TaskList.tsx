'use client';

import { useMemo } from 'react';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { List } from '@signalco/ui/dist/List';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { ListSkeleton } from '../../shared/ListSkeleton';
import { ListItemCreate } from '../../shared/ListItemCreate';
import { useProcessTaskDefinitions } from '../../../src/hooks/useProcessTaskDefinitions';
import { useProcessTaskDefinitionCreate } from '../../../src/hooks/useProcessTaskDefinitionCreate';
import { useProcessRunTasks } from '../../../src/hooks/useProcessRunTasks';
import { TaskListItem } from './TaskListItem';

type TaskListProps = {
    processId: string;
    runId?: string;
    editable: boolean;
};

export function TaskList({ processId, runId, editable }: TaskListProps) {
    const [selectedTaskId, setSelectedTask] = useSearchParam('task');
    const taskDefinitionCreate = useProcessTaskDefinitionCreate();

    const { data: taskDefinitions, isLoading: isLoadingTaskDefinitions, error: errorTaskDefinitions } = useProcessTaskDefinitions(processId);
    const { data: tasks, isLoading: isLoadingTasks, error: errorTasks } = useProcessRunTasks(processId, runId);

    const taskListItems = useMemo(() =>
        taskDefinitions?.map(td => ({
            taskDefinition: td,
            task: tasks?.find(t => t.taskDefinitionId === td.id)
        })) ?? [],
    [taskDefinitions, tasks]);

    const handleCreateTaskDefinition = async () => {
        const result = await taskDefinitionCreate.mutateAsync({
            processId,
            text: 'New task'
        });
        if (result?.id) {
            setSelectedTask(result?.id);
        }
    };

    return (
        <Loadable
            isLoading={isLoadingTaskDefinitions || isLoadingTasks}
            loadingLabel="Loading task definitions..."
            placeholder={<ListSkeleton itemClassName="h-9 w-full" />}
            error={errorTaskDefinitions || errorTasks}>
            <List className="divide-y rounded-lg border">
                {taskListItems.map((item, taskIndex) => (
                    <TaskListItem
                        key={item.taskDefinition.id}
                        selected={selectedTaskId === item.taskDefinition.id.toString()}
                        taskDefinition={item.taskDefinition}
                        runId={runId}
                        task={item.task}
                        taskIndex={taskIndex}
                        editable={editable} />
                ))}
                {editable && (
                    <ListItemCreate
                        label="Add task"
                        onSelected={handleCreateTaskDefinition}
                        loading={taskDefinitionCreate.isPending} />
                )}
                {!editable && taskListItems.length <= 0 && (
                    <NoDataPlaceholder className="p-2">No tasks</NoDataPlaceholder>
                )}
            </List>
        </Loadable>
    );
}
