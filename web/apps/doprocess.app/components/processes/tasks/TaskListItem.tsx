'use client';

import { cx } from 'classix';
import { Delete } from '@signalco/ui-icons';
import { TypographyEditable } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { ListItem } from '../../shared/ListItem';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessRunTaskCreate } from '../../../src/hooks/useProcessRunTaskCreate';
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
    const [, setSelectedTaskId] = useSearchParam('task');
    const taskCreate = useProcessRunTaskCreate();
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
        <div className="relative flex items-center gap-1">
            <ListItem
                className={cx(
                    'peer w-full gap-2 px-3 pr-12 items-start',
                    isComplated && 'text-muted-foreground line-through',
                    !isComplated && 'border-foreground/30'
                )}
                selected={selected}
                startDecorator={(
                    <Row spacing={1}>
                        <Typography level="body3" secondary className="[line-height:1.6em]">{taskIndex + 1}</Typography>
                        {runId
                            ? <Checkbox checked={isComplated} name="checked" type="submit" onCheckedChange={handleCheckedChange} />
                            : undefined
                        }
                    </Row>
                )}
                nodeId={taskDefinition.id.toString()}
                onSelected={setSelectedTaskId}
                label={editable ? (
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
            {(!runId && editable) && (
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
