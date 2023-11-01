'use client';

import { cx } from 'classix';
import { Delete } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { ModalConfirm } from '@signalco/ui/dist/ModalConfirm';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { List } from '@signalco/ui/dist/List';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { Task, TaskDefinition } from '../../src/lib/db/schema';
import { useProcessTaskDefinitionDelete } from './useProcessTaskDefinitionDelete';
import { useProcessRunTaskUpdate } from './useProcessRunTaskUpdate';

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
    const [selectedTaskId, setSelectedTaskId] = useSearchParam('task');
    const taskUpdate = useProcessRunTaskUpdate();
    const taskDelete = useProcessTaskDefinitionDelete();

    const checked = task?.state === 'completed';

    const handleCheckedChange = async (checked: boolean | 'indeterminate') => {
        if (!task) return;

        await taskUpdate.mutateAsync({
            processId: task.processId.toString(),
            runId: task.runId.toString(),
            taskId: task.id.toString(),
            status: checked ? 'completed' : 'new',
        })
    }

    const handleConfirmDelete = async () => {
        if (task) return; // Can't delete definition from process run (task)

        await taskDelete.mutateAsync({
            processId: taskDefinition.processId.toString(),
            taskDefinitionId: taskDefinition.id.toString(),
        });
        if (taskDefinition.id.toString() === selectedTaskId) {
            setSelectedTaskId(undefined);
        }
    };

    // TODO: Preload on hover (to avoid skeletons)

    return (
        <div className="relative flex items-center gap-1">
            <ListItem
                className={cx(
                    'peer w-full gap-2 px-3 rounded-none',
                    checked && 'text-muted-foreground line-through',
                    !checked && 'border-foreground/30',
                )}
                selected={selected}
                startDecorator={task && (
                    <Checkbox checked={checked} name="checked" type="submit" onCheckedChange={handleCheckedChange} />
                )}
                nodeId={taskDefinition.id.toString()}
                onSelected={setSelectedTaskId}
                label={(
                    <Row spacing={1}>
                        <Typography level="body3" secondary>{taskIndex + 1}</Typography>
                        <Typography level="body1" className="truncate">
                            {taskDefinition.text || ''}
                        </Typography>
                    </Row>
                    // taskDefinition.text || ''
                )} />
            {!task && (
                <ModalConfirm
                    header="Are you sure?"
                    onConfirm={handleConfirmDelete}
                    trigger={(
                        <IconButton
                            loading={taskDelete.isPending}
                            size="sm"
                            variant="plain"
                            className="absolute inset-y-1/2 right-[2px] -translate-y-1/2 opacity-0 hover:opacity-100 peer-hover:opacity-100">
                            <Delete size={18} />
                        </IconButton>)}>
                        All the task details will be lost and all existing process runs will lose progress on this task.
                </ModalConfirm>
            )}
        </div>
    )
}

export default function TaskList({ tasks }: TaskListProps) {
    const [selectedTaskId] = useSearchParam('task');

    if (!tasks.length) {
        return (
            <NoDataPlaceholder>No tasks</NoDataPlaceholder>
        );
    }

    return (
        <List className="divide-y rounded-lg border">
            {tasks.map((item, taskIndex) => (
                <TaskListItem
                    key={item.taskDefinition.id}
                    selected={selectedTaskId === item.taskDefinition.id.toString()}
                    taskDefinition={item.taskDefinition}
                    task={item.task}
                    taskIndex={taskIndex} />
            ))}
        </List>
    );
}
