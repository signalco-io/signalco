'use client';

import { useRouter } from 'next/navigation';
import { ModalConfirm, ModalConfirmProps } from '@signalco/ui/dist/ModalConfirm';
import { useProcessDelete } from '../../src/hooks/useProcessDelete';
import { ProcessDto } from '../../app/api/dtos/dtos';

type ProcessDeleteModalProps = Omit<ModalConfirmProps, 'header' | 'onConfirm' | 'children' | 'expectedConfirm' | 'promptLabel'> & {
    process: ProcessDto;
    redirect?: string;
};

export function ProecssDeleteModal({ process, redirect, ...rest }: ProcessDeleteModalProps) {
    const router = useRouter();
    const processDelete = useProcessDelete();

    const handleConfirmDelete = async () => {
        await processDelete.mutateAsync({
            id: process.id,
        });
        if (redirect) {
            router.push(redirect);
        }
    };

    return (
        <ModalConfirm
            header="Are you sure?"
            onConfirm={handleConfirmDelete}
            {...rest}>
            By deleting this process, all existing runs will be deleted too.
        </ModalConfirm>
    );
}
