import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Stack } from '@mui/system';
import { Card, CardHeader, CardMedia, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import useLocale from 'src/hooks/useLocale';
import IEntityDetails from 'src/entity/IEntityDetails';
import Timeago from 'components/shared/time/Timeago';
import AutoTable from 'components/shared/table/AutoTable';

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
    const handleCreateContact = () => {
    };

    return (
        <>
            <Card>
                <CardHeader
                    title={t('Contacts')}
                    action={<IconButton {...bindTrigger(popupState)}>
                        <MoreVertIcon />
                    </IconButton>} />
                <CardMedia>
                    <Stack spacing={4}>
                        <AutoTable error={error} isLoading={isLoading} items={tableItems} localize={t} />
                    </Stack>
                </CardMedia>
            </Card>
            <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={handleCreateContact}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText>{t('CreateContact')}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
