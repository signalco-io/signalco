'use client';

import { useEffect, useState } from 'react';
import { cx } from 'classix';
import { Delete } from '@signalco/ui-icons';
import { TypographyEditable } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { ListItem } from '../../shared/ListItem';
import { Task, TaskDefinition } from '../../../src/lib/db/schema';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessRunTaskUpdate } from '../../../src/hooks/useProcessRunTaskUpdate';
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
    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();

    const checked = task?.state === 'completed';

    // TODO: Maybe use a custom hook for this? - optimistic update
    const [text, setText] = useState(taskDefinition.text || '');
    useEffect(() => {
        setText(taskDefinition.text || '');
    }, [taskDefinition.text]);
    const handleTextChange = async (text: string) => {
        setText(text);
        await taskDefinitionUpdate.mutateAsync({
            processId: taskDefinition.processId?.toString(),
            taskDefinitionId: taskDefinition.id?.toString(),
            text
        });
    }

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
                    'peer w-full gap-2 px-3 pr-12',
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
                        {editable ? (
                            <TypographyEditable
                                level="body1"
                                className="w-full bg-transparent outline-none"
                                onChange={handleTextChange}
                                hideEditIcon
                                multiple>
                                {text}
                            </TypographyEditable>
                        ) : (
                            <Typography level="body1">{text}</Typography>
                        )}
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
