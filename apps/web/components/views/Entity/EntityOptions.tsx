import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { MoreHorizontal } from '@signalco/ui-icons';
import { Button, Divider, Menu, MenuItem } from '@signalco/ui';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import { showNotification } from '../../../src/notifications/PageNotificationService';
import { KnownPages } from '../../../src/knownPages';
import useLocale from '../../../src/hooks/useLocale';
import useEntity from '../../../src/hooks/useEntity';
import { entityDeleteAsync } from '../../../src/entity/EntityRepository';

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
    const popupState = usePopupState({ variant: 'popover', popupId: 'entityOptionsMenu' });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: entity } = useEntity(id);

    const handleDelete = () => {
        popupState.close();
        setIsDeleteOpen(true);
    };

    const handleShowRaw = () => {
        popupState.close();
        showRawChanged(!showRaw);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (typeof id === 'undefined')
                throw new Error('Entity identifier not present.');

            await entityDeleteAsync(id);
            router.push(KnownPages.Entities);
        } catch (err) {
            console.error('Failed to delete entity', err);
            showNotification(t('DeleteErrorUnknown'));
        }
    };

    return (
        <>
            <Button {...bindTrigger(popupState)}>
                <MoreHorizontal />
            </Button>
            <Menu {...bindMenu(popupState)}>
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
