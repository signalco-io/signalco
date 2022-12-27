import { useMemo, useState } from 'react';
import { DisableButton, Avatar, Box, EditableInput, Timeago, MuiStack, Row, Stack } from '@signalco/ui';
import EntityProcessDetails from './EntityProcessDetails';
import EntityOptions from './EntityOptions';
import ContactsTable from './ContactsTable';
import EntityIcon from '../../shared/entity/EntityIcon';
import ShareEntityChip from '../../entity/ShareEntityChip';
import EntityStatus, { useEntityStatus } from '../../entity/EntityStatus';
import useEntity from '../../../src/hooks/signalco/useEntity';
import useContact from '../../../src/hooks/signalco/useContact';
import { entityRenameAsync } from '../../../src/entity/EntityRepository';
import { entityLastActivity } from '../../../src/entity/EntityHelper';
import { setAsync } from '../../../src/contacts/ContactRepository';


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
        <MuiStack spacing={{ xs: 1, sm: 4 }} sx={{ pt: { xs: 0, sm: 2 } }}>
            <Stack style={{ paddingLeft: 16, paddingRight: 16 }} spacing={1}>
                <Row spacing={1} justifyContent="space-between">
                    <Row spacing={2}>
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
                    </Row>
                    <EntityOptions
                        id={id}
                        canHideRaw={detailsComponent != null}
                        showRaw={showRaw}
                        showRawChanged={(show) => setShowRaw(show)} />
                </Row>
                <Row spacing={1}>
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
                </Row>
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
        </MuiStack>
    );
}
