import { ToggleButton } from '@mui/material';
import { Stack, Box } from '@mui/system';
import EntityStatus from 'components/entity/EntityStatus';
import ShareEntityChip from 'components/entity/ShareEntityChip';
import EditableInput from 'components/shared/form/EditableInput';
import { useMemo } from 'react';
import { entityRenameAsync } from 'src/entity/EntityRepository';
import useContact from 'src/hooks/useContact';
import useEntity from 'src/hooks/useEntity';
import EntityProcessDetails from './EntityProcessDetails';
import ContactsTable from './ContactsTable';
import EntityOptions from './EntityOptions';

export default function EntityDetailsView(props: { id: string }) {
    const { id } = props;
    const { data: entity } = useEntity(id);

    const handleRename = async (newAlias: string) => {
        if (id) {
            await entityRenameAsync(id, newAlias);
        }
    }

    const detailsComponent = useMemo(() => {
        switch (entity?.type) {
            case 3:
                return <EntityProcessDetails entity={entity} />
            default:
                return null;
        }
    }, [entity]);

    const disabledContact = useContact(entity && { entityId: entity.id, channelName: 'config', contactName: 'disabled' });

    return (
        <Stack spacing={{ xs: 1, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Stack sx={{ px: 2 }} spacing={1}>
                <Stack direction="row" spacing={1}>
                    <EditableInput
                        sx={{
                            fontWeight: 300,
                            fontSize: { xs: 18, sm: 24 }
                        }}
                        text={entity?.alias || ''}
                        noWrap
                        onChange={handleRename} />
                    <EntityOptions id={id} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <EntityStatus entity={entity} />
                    <ShareEntityChip entity={entity} entityType={1} />
                    {!disabledContact.isError && (
                        <ToggleButton value={disabledContact.data?.valueSerialized === 'true'}>Disable</ToggleButton>
                    )}
                </Stack>
            </Stack>
            <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <ContactsTable entity={entity} />
                {detailsComponent}
            </Box>
        </Stack>
    );
}
