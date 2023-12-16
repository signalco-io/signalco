'use client';

import { useRouter } from 'next/navigation';
import { ModalConfirm, ModalConfirmProps } from '@signalco/ui/ModalConfirm';
import { useProcessRunDelete } from '../../../src/hooks/useProcessRunDelete';
import { useProcessDelete } from '../../../src/hooks/useProcessDelete';

type ProcessDeleteModalProps = Omit<ModalConfirmProps, 'header' | 'onConfirm' | 'children' | 'expectedConfirm' | 'promptLabel'> & {
    processId: string;
    runId?: string;
    redirect?: string;
};

export function ProcessOrRunDeleteModal({ processId, runId, redirect, ...rest }: ProcessDeleteModalProps) {
    const router = useRouter();
    const processDelete = useProcessDelete();
    const processRunDelete = useProcessRunDelete();

    const handleConfirmDelete = async () => {
        if (runId) {
            await processRunDelete.mutateAsync({
                processId,
                runId,
            });
        } else {
            await processDelete.mutateAsync({
                processId,
            });
        }
        if (redirect) {
            router.push(redirect);
        }
    };

    return (
        <ModalConfirm
            header="Are you sure?"
            onConfirm={handleConfirmDelete}
            {...rest}>
            {runId ? 'By deleting this process run, all process run progress will be lost.' :'By deleting this process, all existing runs will be deleted too.'}
        </ModalConfirm>
    );
}
