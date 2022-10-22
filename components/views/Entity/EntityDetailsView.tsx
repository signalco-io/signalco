import { useMemo } from 'react';
import { Box, Stack } from '@mui/system';
import useEntity from 'src/hooks/useEntity';
import useContact from 'src/hooks/useContact';
import { entityRenameAsync } from 'src/entity/EntityRepository';
import EditableInput from 'components/shared/form/EditableInput';
import DisableButton from 'components/shared/buttons/DisableButton';
import ShareEntityChip from 'components/entity/ShareEntityChip';
import EntityStatus from 'components/entity/EntityStatus';
import EntityProcessDetails from './EntityProcessDetails';
import EntityOptions from './EntityOptions';
import ContactsTable from './ContactsTable';

export interface EntityDetailsViewProps {
    id: string;
}

export default function EntityDetailsView(props: EntityDetailsViewProps) {
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
    const isDisabled = disabledContact.data?.valueSerialized === 'true';

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
                    {(!disabledContact.isLoading && !disabledContact.isError) && (
                        <DisableButton disabled={isDisabled} />
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
