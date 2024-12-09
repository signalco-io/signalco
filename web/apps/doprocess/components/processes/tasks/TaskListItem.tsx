'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Checkbox } from '@signalco/ui-primitives/Checkbox';
import { Delete, Drag } from '@signalco/ui-icons';
import { TypographyEditable } from '@signalco/ui/TypographyEditable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessRunTaskUpsert } from '../../../src/hooks/useProcessRunTaskUpsert';
import { ProcessRunTaskDto, ProcessTaskDefinitionDto } from '../../../app/api/dtos/dtos';
import { TaskDeleteModal } from './TaskDeleteModal';

export type TaskListItemProps = {
    selected?: boolean;
    taskDefinition: ProcessTaskDefinitionDto;
    runId?: string;
    task?: ProcessRunTaskDto;
    taskIndex: number;
    editable: boolean;
}

export function TaskListItem({ selected, taskDefinition, runId, task, taskIndex, editable }: TaskListItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({ id: taskDefinition.id, disabled: !editable || Boolean(runId) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [, setSelectedTaskId] = useSearchParam('task');
    const taskCreate = useProcessRunTaskUpsert();
    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();

    const handleTextChange = async (text: string) => {
        await taskDefinitionUpdate.mutateAsync({
            processId: taskDefinition.processId?.toString(),
            taskDefinitionId: taskDefinition.id?.toString(),
            text
        });
    }
    const textMutatedOrOriginal = taskDefinitionUpdate.variables?.text ?? taskDefinition?.text;

    const isComplated = task?.state === 'completed';
    const handleCheckedChange = async (checked: boolean | 'indeterminate') => {
        if (!runId) return;

        await taskCreate.mutateAsync({
            processId: taskDefinition.processId,
            runId,
            taskDefinitionId: taskDefinition.id,
            state: checked ? 'completed' : 'new',
        })
    };

    // TODO: Preload item details on hover (to avoid skeletons)

    return (
        <ListItem
            buttonRef={setNodeRef}
            style={style}
            {...attributes}
            className={cx(
                'relative peer group w-full gap-2 px-3 pr-12 text-base',
                isComplated && 'text-muted-foreground line-through',
            )}
            variant="outlined"
            selected={selected}
            startDecorator={(
                <Row spacing={1}>
                    <div ref={setActivatorNodeRef}
                        {...listeners}
                        className="size-[18px] text-center">
                        {(!runId && editable) && (
                            <Drag
                                size={18}
                                className="hidden hover:cursor-grab active:cursor-grabbing group-hover:block" />
                        )}
                        <Typography
                            level="body3"
                            className={cx(
                                '[line-height:1.6em]',
                                (!runId && editable) && 'block group-hover:hidden'
                            )}>{taskIndex + 1}</Typography>
                    </div>
                    {runId
                        ? <Checkbox checked={isComplated} name="checked" type="submit" onCheckedChange={handleCheckedChange} />
                        : undefined
                    }
                </Row>
            )}
            endDecorator={(
                <>
                    {(!runId && editable) && (
                        <TaskDeleteModal
                            title="Delete task definition"
                            taskDefinition={taskDefinition}
                            trigger={(
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    className="absolute inset-y-1/2 right-[2px] -translate-y-1/2 opacity-0 hover:opacity-100 group-hover:opacity-100">
                                    <Delete size={18} />
                                </IconButton>
                            )} />
                    )}
                </>
            )}
            nodeId={taskDefinition.id.toString()}
            onSelected={setSelectedTaskId}
            label={(!runId && editable) ? (
                <TypographyEditable
                    level="body1"
                    className={cx('w-full outline-none')}
                    onChange={handleTextChange}
                    placeholder="No description"
                    hideEditIcon
                    multiple>
                    {textMutatedOrOriginal}
                </TypographyEditable>
            ) : (
                <Typography level="body1" secondary={!textMutatedOrOriginal}>{textMutatedOrOriginal ?? 'No description'}</Typography>
            )}
        />
    );
}
