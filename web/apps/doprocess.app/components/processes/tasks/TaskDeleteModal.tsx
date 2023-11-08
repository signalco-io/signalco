'use client';

import { ModalConfirm, ModalConfirmProps } from '@signalco/ui/dist/ModalConfirm';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { TaskDefinition } from '../../../src/lib/db/schema';
import { useProcessTaskDefinitionDelete } from '../../../src/hooks/useProcessTaskDefinitionDelete';

type TaskDeleteModalProps = Omit<ModalConfirmProps, 'header' | 'onConfirm' | 'children' | 'expectedConfirm' | 'promptLabel'> & {
    taskDefinition: TaskDefinition;
};

export function TaskDeleteModal({ taskDefinition, ...rest }: TaskDeleteModalProps) {
    const [selectedTaskId, setSelectedTaskId] = useSearchParam('task');
    const taskDelete = useProcessTaskDefinitionDelete();

    const handleConfirmDelete = async () => {
        await taskDelete.mutateAsync({
            processId: taskDefinition.processId.toString(),
            taskDefinitionId: taskDefinition.id.toString(),
        });
        if (taskDefinition.id.toString() === selectedTaskId) {
            setSelectedTaskId(undefined);
        }
    };

    return (
        <ModalConfirm
            header="Are you sure?"
            onConfirm={handleConfirmDelete}
            {...rest}>
            By deleting this task, all existing process runs will lose progress on this task.
        </ModalConfirm>
    );
}
