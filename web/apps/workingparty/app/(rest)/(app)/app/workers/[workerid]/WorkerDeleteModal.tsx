'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ModalConfirm } from '@signalco/ui/ModalConfirm';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../../src/knownPages';

function useWorkerDelete(workerId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await fetch(`/api/workers/${workerId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workers'] });
        }
    });
}

export function WorkerDeleteModal({ worker, workerId }: { worker?: { name: string; }; workerId: string; }) {
    const router = useRouter();
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useSearchParam('deleteWorker');
    const deleteThread = useWorkerDelete(workerId);
    const handleDeleteConfirm = async () => {
        await deleteThread.mutateAsync();
        router.push(KnownPages.App);
    };

    return (
        <ModalConfirm
            open={showDeleteConfirmModal === 'true'}
            onOpenChange={(open) => setShowDeleteConfirmModal(open ? 'true' : undefined)}
            header={'Delete Worker'}
            color="danger"
            expectedConfirm={worker?.name ?? 'delete'}
            promptLabel={`To confirm, type the worker name "${worker?.name ?? 'delete'}" and confirm.`}
            onConfirm={handleDeleteConfirm}>
            Are you sure you want to delete this worker? This action cannot be undone.
        </ModalConfirm>
    );
}
