'use client';

import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { useSearchParam, useSetSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { Task, TaskDefinition } from '../src/lib/db/schema';
import { updateTaskStateFormAction } from '../app/processes/[id]/actions';

type TaskListProps = {
    tasks: {
        taskDefinition: TaskDefinition;
        task?: Task;
    }[];
};

type TaskListItemProps = {
    selected?: boolean;
    taskDefinition: TaskDefinition;
    task?: Task;
    taskIndex: number;
}

function TaskListItem({ selected, taskDefinition, task, taskIndex }: TaskListItemProps) {
    const setSelectedTaskId = useSetSearchParam('task');

    const checked = task?.state === 'completed';

    return (
        <>
            <Typography level="body3" secondary>{taskIndex + 1}</Typography>
            <ListItem
                className={cx(
                    'w-full gap-2 border px-2',
                    checked && 'text-muted-foreground line-through',
                    !checked && 'border-foreground/30',
                )}
                selected={selected}
                startDecorator={task && (
                    <form action={updateTaskStateFormAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <Checkbox checked={checked} name="checked" type="submit" />
                    </form>
                )}
                nodeId={taskDefinition.id.toString()}
                onSelected={setSelectedTaskId}
                label={taskDefinition.text || ''} />
        </>
    )
}

export default function TaskList({ tasks }: TaskListProps) {
    const [selectedTaskId] = useSearchParam('task');

    return (
        <>
            {!tasks.length && <NoDataPlaceholder>No tasks</NoDataPlaceholder>}
            <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-center">
                {tasks.map((item, taskIndex) => (
                    <TaskListItem
                        key={item.taskDefinition.id}
                        selected={selectedTaskId === item.taskDefinition.id.toString()}
                        taskDefinition={item.taskDefinition}
                        task={item.task}
                        taskIndex={taskIndex} />
                ))}
            </div>
        </>
    );
}
