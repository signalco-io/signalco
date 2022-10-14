import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Button, Menu, MenuItem } from '@mui/joy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PageNotificationService from 'src/notifications/PageNotificationService';
import useLocale from 'src/hooks/useLocale';
import useEntity from 'src/hooks/useEntity';
import { entityDeleteAsync } from 'src/entity/EntityRepository';
import ConfirmDeleteDialog from 'components/shared/dialog/ConfirmDeleteDialog';

export default function EntityOptions(props: { id: string | undefined; }) {
    const { id } = props;
    const { t } = useLocale('App', 'Entities');
    const router = useRouter();
    const popupState = usePopupState({ variant: 'popover', popupId: 'entityOptionsMenu' });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: entity } = useEntity(id);

    const handleDelete = () => {
        popupState.close();
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (typeof id === 'undefined')
                throw new Error('Entity identifier not present.');

            await entityDeleteAsync(id);
            router.push('/app/entities');
        } catch (err) {
            PageNotificationService.show(t('DeleteErrorUnknown'));
        }
    };

    return (
        <>
            <Button {...bindTrigger(popupState)}>
                <MoreHorizIcon />
            </Button>
            <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={handleDelete}>{t('DeleteButtonLabel')}</MenuItem>
            </Menu>
            <ConfirmDeleteDialog
                expectedConfirmText={entity?.alias || t('ConfirmDialogExpectedText')}
                title={t('DeleteTitle')}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm} />
        </>
    );
}
