'use client';

import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { List } from '@signalco/ui/dist/List';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { Task, TaskDefinition } from '../../src/lib/db/schema';
import { useProcessTaskDefinitionCreate } from './useProcessTaskDefinitionCreate';
import { TaskListItem } from './TaskListItem';
import { ListItemCreate } from './ListItemCreate';

type TaskListProps = {
    processId: string;
    tasks: {
        taskDefinition: TaskDefinition;
        task?: Task;
    }[];
    editable: boolean;
};

export default function TaskList({ processId, tasks, editable }: TaskListProps) {
    const [selectedTaskId, setSelectedTask] = useSearchParam('task');
    const taskDefinitionCreate = useProcessTaskDefinitionCreate();

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
        <List className="divide-y rounded-lg border">
            {tasks.map((item, taskIndex) => (
                <TaskListItem
                    key={item.taskDefinition.id}
                    selected={selectedTaskId === item.taskDefinition.id.toString()}
                    taskDefinition={item.taskDefinition}
                    task={item.task}
                    taskIndex={taskIndex}
                    editable={editable} />
            ))}
            {editable && (
                <ListItemCreate label="Add task" onSelected={handleCreateTaskDefinition} />
            )}
            {!editable && tasks.length <= 0 && (
                <NoDataPlaceholder className="p-2">No tasks</NoDataPlaceholder>
            )}
        </List>
    );
}
