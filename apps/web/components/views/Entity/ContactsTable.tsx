import React, { useState } from 'react';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Stack } from '@mui/system';
import { Button, Card, CardOverflow, IconButton, ListItemDecorator, Menu, MenuItem, TextField, Typography } from '@mui/joy';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import SelectItems from '../../shared/form/SelectItems';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import useLocale from '../../../src/hooks/useLocale';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import { setAsync } from '../../../src/contacts/ContactRepository';
import Timeago from '../../../components/shared/time/Timeago';
import AutoTable from '../../../components/shared/table/AutoTable';

export default function ContactsTable(props: { entity: IEntityDetails | undefined; }) {
    const { entity } = props;
    const { t } = useLocale('App', 'Entities');

    const tableItems = entity?.contacts?.map(c => ({
        id: c.contactName,
        name: c.contactName,
        channel: c.channelName,
        value: c.valueSerialized,
        lastActivity: <Timeago date={c.timeStamp} live />
    }));
    const isLoading = false;
    const error = undefined;

    const popupState = usePopupState({ variant: 'popover', popupId: 'contactsMenu' });
    const createContactDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const editContactValueDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const [channelName, setChannelName] = useState('');
    const [contactName, setContactName] = useState('');
    const [editingContact, setEditingContact] = useState('');
    const [valueSerialized, setValueSerialized] = useState('');

    const handleCreateSubmit = async () => {
        if (entity) {
            await setAsync({
                entityId: entity.id,
                channelName,
                contactName
            }, undefined);
        }
        createContactDialogState.close();
    };
    const handleEditValueSubmit = async () => {
        if (entity) {
            await setAsync({
                entityId: entity.id,
                channelName: entity.contacts.find(c => c.contactName === editingContact)?.channelName ?? '',
                contactName: editingContact
            }, valueSerialized);
        }
        editContactValueDialogState.close();
    };

    return (
        <>
            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>{t('Contacts')}</Typography>
                    <IconButton size="sm" {...bindTrigger(popupState)}>
                        <MoreVertIcon />
                    </IconButton>
                </Stack>
                <CardOverflow>
                    <Stack spacing={4}>
                        <AutoTable error={error} isLoading={isLoading} items={tableItems} localize={t} />
                    </Stack>
                </CardOverflow>
            </Card>
            <Menu {...bindMenu(popupState)}>
                <MenuItem {...bindTrigger(createContactDialogState)}>
                    <ListItemDecorator>
                        <AddIcon />
                    </ListItemDecorator>
                    {t('CreateContact')}
                </MenuItem>
                <MenuItem {...bindTrigger(editContactValueDialogState)}>
                    <ListItemDecorator>
                        <AddIcon />
                    </ListItemDecorator>
                    {t('EditContact')}
                </MenuItem>
            </Menu>
            <ConfigurationDialog
                isOpen={createContactDialogState.isOpen}
                title="Create contact"
                onClose={createContactDialogState.close}>
                <Stack spacing={1}>
                    <TextField value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                    <TextField value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Button onClick={handleCreateSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfigurationDialog
                isOpen={editContactValueDialogState.isOpen}
                title="Create contact"
                onClose={editContactValueDialogState.close}>
                <Stack spacing={1}>
                    <SelectItems
                        items={entity?.contacts?.map(c => ({ value: c.contactName, label: c.contactName })) ?? []}
                        value={editingContact ? [editingContact] : []}
                        onChange={(values) => setEditingContact(values[0])} />
                    <TextField value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
                    <Button onClick={handleEditValueSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
        </>
    );
}
