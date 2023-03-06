import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from '@signalco/ui-icons';
import { Button, Divider, Menu, MenuItem } from '@signalco/ui';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import { showNotification } from '../../../src/notifications/PageNotificationService';
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

export default function EntityOptions(props: EntityOptionsProps) {
    const { id, canHideRaw, showRaw, showRawChanged } = props;
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
            <Menu menuId="entity-options" renderTrigger={(props) => (
                <Button {...props}>
                    <MoreHorizontal />
                </Button>
            )}>
                {canHideRaw && <MenuItem onClick={handleShowRaw}>{showRaw ? 'Hide details' : 'Show details'}</MenuItem>}
                <Divider />
                <MenuItem onClick={handleDelete}>{t('DeleteButtonLabel')}</MenuItem>
            </Menu>
            <ConfirmDeleteDialog
                expectedConfirmText={entity?.alias || t('ConfirmDialogExpectedText')}
                header={t('DeleteTitle')}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm} />
        </>
    );
}
