import { useMemo, useState } from 'react';
import { DisableButton , Avatar } from '@signalco/ui';
import { Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import useEntity from 'src/hooks/useEntity';
import useContact from 'src/hooks/useContact';
import { entityRenameAsync } from 'src/entity/EntityRepository';
import { entityLastActivity } from 'src/entity/EntityHelper';
import { setAsync } from 'src/contacts/ContactRepository';
import Timeago from 'components/shared/time/Timeago';
import EditableInput from 'components/shared/form/EditableInput';
import EntityIcon from 'components/shared/entity/EntityIcon';
import ShareEntityChip from 'components/entity/ShareEntityChip';
import EntityStatus, { useEntityStatus } from 'components/entity/EntityStatus';
import EntityProcessDetails from './EntityProcessDetails';
import EntityOptions from './EntityOptions';
import ContactsTable from './ContactsTable';


export interface EntityDetailsViewProps {
    id: string;
}

export default function EntityDetailsView(props: EntityDetailsViewProps) {
    const { id } = props;
    const { data: entity } = useEntity(id);
    const [showRaw, setShowRaw] = useState(false);

    const Icon = EntityIcon(entity);
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);

    const handleRename = async (newAlias: string) => {
        if (id) {
            await entityRenameAsync(id, newAlias);
        }
    }

    const disabledContactPointer = entity && { entityId: entity.id, channelName: 'signalco', contactName: 'disabled' };
    const disabledContact = useContact(disabledContactPointer);
    const isDisabled = disabledContact.data?.valueSerialized === 'true';
    const handleDisableToggle = async () => {
        if (disabledContactPointer) {
            await setAsync(disabledContactPointer, (!isDisabled).toString())
        }
    };

    const detailsComponent = useMemo(() => {
        switch (entity?.type) {
            case 3:
                return <EntityProcessDetails entity={entity} />
            default:
                return null;
        }
    }, [entity]);
    const showRawResolved = useMemo(() => detailsComponent == null || showRaw, [detailsComponent, showRaw]);

    return (
        <Stack spacing={{ xs: 1, sm: 4 }} sx={{ pt: { xs: 0, sm: 2 } }}>
            <Stack sx={{ px: 2 }} spacing={1}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>
                            <Icon />
                        </Avatar>
                        <EditableInput
                            sx={{
                                fontWeight: 300,
                                fontSize: { xs: 18, sm: 24 }
                            }}
                            text={entity?.alias || ''}
                            noWrap
                            onChange={handleRename} />
                    </Stack>
                    <EntityOptions
                        id={id}
                        canHideRaw={detailsComponent != null}
                        showRaw={showRaw}
                        showRawChanged={(show) => setShowRaw(show)} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <EntityStatus entity={entity} />
                    {(hasStatus && (isStale || isOffline)) && (
                        <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                            <Timeago date={entityLastActivity(entity)} />
                        </Box>
                    )}
                    {(!disabledContact.isLoading && !disabledContact.isError) && (
                        <DisableButton disabled={isDisabled} onClick={handleDisableToggle} />
                    )}
                    <ShareEntityChip entity={entity} entityType={1} />
                </Stack>
            </Stack>
            <Box sx={{ px: { xs: 1, sm: 2 } }}>
                {showRawResolved ? (
                    <ContactsTable entity={entity} />
                ) : (
                    <>
                        {detailsComponent}
                    </>
                )}
            </Box>
        </Stack>
    );
}
