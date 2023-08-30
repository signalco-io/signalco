'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/dist/Timeago';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { EditableInput } from '@signalco/ui/dist/EditableInput';
import { DisableButton } from '@signalco/ui/dist/DisableButton';
import { Chip } from '@signalco/ui/dist/Chip';
import { Avatar } from '@signalco/ui/dist/Avatar';
import { camelToSentenceCase } from '@signalco/js';
import EntityIcon from '../../shared/entity/EntityIcon';
import BatteryIndicator from '../../indicators/BatteryIndicator';
import ShareEntityChip from '../../entity/ShareEntityChip';
import EntityStatus, { useEntityStatus } from '../../entity/EntityStatus';
import { useEntityBattery } from '../../entity/EntityBattery';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import { entityRenameAsync } from '../../../src/entity/EntityRepository';
import { entityLastActivity } from '../../../src/entity/EntityHelper';
import { setAsync } from '../../../src/contacts/ContactRepository';
import EntityProcessDetails from './EntityProcessDetails';
import EntityOptions from './EntityOptions';
import ContactsTable from './ContactsTable';

export interface EntityDetailsViewProps {
    id?: string;
}

export default function EntityDetailsView({ id }: EntityDetailsViewProps) {
    const { isLoading, error, data: entity } = useEntity(id);
    const [showRaw, setShowRaw] = useState(false);

    const Icon = EntityIcon(entity);
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);

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

    const visitLinks = entity?.contacts
        .filter(c => (c.contactName === 'visit' || c.contactName.startsWith('visit-')) && c.valueSerialized)
        .map(c => ({
            alias: c.contactName.includes('-') ? camelToSentenceCase(c.contactName.substring(c.contactName.indexOf('-') + 1)) : 'Visit',
            href: c.valueSerialized as string
        }));

    const detailsComponent = useMemo(() => {
        switch (entity?.type) {
        case 3:
            return <EntityProcessDetails entity={entity} />
        default:
            return null;
        }
    }, [entity]);
    const showRawResolved = useMemo(() => detailsComponent == null || showRaw, [detailsComponent, showRaw]);

    if (!isLoading && !error && entity == null) {
        return (
            <NoDataPlaceholder content={'Not Found'} />
        );
    }
    return (
        <Loadable isLoading={isLoading} loadingLabel="Loading entity" error={error}>
            <div className="xs:gap-1 flex flex-col sm:gap-4 sm:pt-2">
                <Stack style={{ paddingLeft: 16, paddingRight: 16 }} spacing={1}>
                    <Row spacing={1} justifyContent="space-between">
                        <Row spacing={2}>
                            <Avatar>
                                <Icon />
                            </Avatar>
                            <EditableInput
                                className="xs:text-lg font-light sm:text-2xl"
                                value={entity?.alias || ''}
                                onChange={handleRename} />
                        </Row>
                        <EntityOptions
                            id={id}
                            canHideRaw={detailsComponent != null}
                            showRaw={showRaw}
                            showRawChanged={setShowRaw} />
                    </Row>
                    <Row spacing={1}>
                        <EntityStatus entity={entity} />
                        {hasBattery &&
                            <Chip>
                                <BatteryIndicator level={level} size="sm" />
                                {`${level}%`}
                            </Chip>
                        }
                        {(hasStatus && (isStale || isOffline)) && (
                            <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                <Timeago date={entityLastActivity(entity)} />
                            </div>
                        )}
                        {(!disabledContact.isLoading && !disabledContact.isError) && (
                            <DisableButton disabled={isDisabled} onClick={handleDisableToggle} />
                        )}
                        <ShareEntityChip entity={entity} entityType={1} />
                        {visitLinks?.map(link => (
                            <Chip key={link.href} href={link.href} startDecorator={<ExternalLink size={16} />}>{link.alias}</Chip>
                        ))}
                    </Row>
                </Stack>
                <div className="px-1 sm:px-2">
                    {showRawResolved ? (
                        <ContactsTable entity={entity} />
                    ) : (
                        <>
                            {detailsComponent}
                        </>
                    )}
                </div>
            </div>
        </Loadable>
    );
}
