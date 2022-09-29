import { Button, ListItemText, Menu, MenuItem } from '@mui/material';
import ConfirmDeleteDialog from 'components/shared/dialog/ConfirmDeleteDialog';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { entityDeleteAsync } from 'src/entity/EntityRepository';
import useEntity from 'src/hooks/useEntity';
import useLocale from 'src/hooks/useLocale';
import PageNotificationService from 'src/notifications/PageNotificationService';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
                <MenuItem onClick={handleDelete}>
                    <ListItemText>{t('DeleteButtonLabel')}</ListItemText>
                </MenuItem>
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
