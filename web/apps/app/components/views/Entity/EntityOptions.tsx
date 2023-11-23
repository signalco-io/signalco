import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { MoreHorizontal } from '@signalco/ui-icons';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import { KnownPages } from '../../../src/knownPages';
import useLocale from '../../../src/hooks/useLocale';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import useDeleteEntity from '../../../src/hooks/signalco/entity/useDeleteEntity';

export interface EntityOptionsProps {
    id: string | undefined;
    canHideRaw: boolean;
    showRaw: boolean;
    showRawChanged: (show: boolean) => void;
}

export default function EntityOptions({ id, canHideRaw, showRaw, showRawChanged, ...rest }: EntityOptionsProps) {
    const { t } = useLocale('App', 'Entities');
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: entity } = useEntity(id);
    const deleteEntity = useDeleteEntity();

    const handleDelete = () => {
        setIsDeleteOpen(true);
    };

    const handleShowRaw = () => {
        showRawChanged(!showRaw);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (typeof id === 'undefined')
                throw new Error('Entity identifier not present.');

            await deleteEntity.mutateAsync(id);
            router.push(KnownPages.Entities);
        } catch (err) {
            console.error('Failed to delete entity', err);
            showNotification(t('DeleteErrorUnknown'));
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="plain" {...rest}>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {canHideRaw && <DropdownMenuItem onSelect={handleShowRaw}>{showRaw ? 'Hide details' : 'Show details'}</DropdownMenuItem>}
                    {canHideRaw && <DropdownMenuSeparator />}
                    <DropdownMenuItem onSelect={handleDelete}>{t('DeleteButtonLabel')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDeleteDialog
                expectedConfirmText={entity?.alias || t('ConfirmDialogExpectedText')}
                header={t('DeleteTitle')}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm} />
        </>
    );
}
