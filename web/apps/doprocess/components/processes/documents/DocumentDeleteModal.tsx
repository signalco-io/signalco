'use client';

import { useRouter } from 'next/navigation';
import { ModalConfirm, ModalConfirmProps } from '@signalco/ui/ModalConfirm';
import { useDocumentDelete } from '../../../src/hooks/useDocumentDelete';
import { DocumentDto } from '../../../app/api/dtos/dtos';

type DocumentDeleteModalProps = Omit<ModalConfirmProps, 'header' | 'onConfirm' | 'children' | 'expectedConfirm' | 'promptLabel'> & {
    document: DocumentDto;
    redirect?: string;
};

export function DocumentDeleteModal({ document, redirect, ...rest }: DocumentDeleteModalProps) {
    const router = useRouter();
    const documentDelete = useDocumentDelete();

    const handleConfirmDelete = async () => {
        await documentDelete.mutateAsync({
            id: document.id,
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
            By deleting this document, all existing tasks assigned that have this document assigned to them will be left empty.
        </ModalConfirm>
    );
}
