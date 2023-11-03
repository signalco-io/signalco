'use client';

import { cx } from 'classix';
import { Delete } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { Task, TaskDefinition } from '../../src/lib/db/schema';
import { useProcessRunTaskUpdate } from './useProcessRunTaskUpdate';
import { TaskDeleteModal } from './TaskDeleteModal';

export type TaskListItemProps = {
    selected?: boolean;
    taskDefinition: TaskDefinition;
    task?: Task;
    taskIndex: number;
    editable: boolean;
}

export function TaskListItem({ selected, taskDefinition, task, taskIndex, editable }: TaskListItemProps) {
    const [, setSelectedTaskId] = useSearchParam('task');
    const taskUpdate = useProcessRunTaskUpdate();

    const checked = task?.state === 'completed';

    const handleCheckedChange = async (checked: boolean | 'indeterminate') => {
        if (!task) return;

        await taskUpdate.mutateAsync({
            processId: task.processId.toString(),
            runId: task.runId.toString(),
            taskId: task.id.toString(),
            status: checked ? 'completed' : 'new',
        });
    };

    // TODO: Preload on hover (to avoid skeletons)
    return (
        <div className="relative flex items-center gap-1">
            <ListItem
                className={cx(
                    'peer w-full gap-2 px-3 rounded-none',
                    checked && 'text-muted-foreground line-through',
                    !checked && 'border-foreground/30'
                )}
                selected={selected}
                startDecorator={task && (
                    <Checkbox checked={checked} name="checked" type="submit" onCheckedChange={handleCheckedChange} />
                )}
                nodeId={taskDefinition.id.toString()}
                onSelected={setSelectedTaskId}
                label={(
                    <Row spacing={1} className="items-start">
                        <Typography level="body3" secondary className="[line-height:1.6em]">{taskIndex + 1}</Typography>
                        <Typography level="body1">
                            {taskDefinition.text || ''}
                        </Typography>
                    </Row>
                )} />
            {(!task && editable) && (
                <TaskDeleteModal
                    taskDefinition={taskDefinition}
                    trigger={(
                        <IconButton
                            size="sm"
                            variant="plain"
                            className="absolute inset-y-1/2 right-[2px] -translate-y-1/2 opacity-0 hover:opacity-100 peer-hover:opacity-100">
                            <Delete size={18} />
                        </IconButton>
                    )} />
            )}
        </div>
    );
}
