'use client';

import { Suspense, type PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Chip } from '@signalco/ui-primitives/Chip';
import { ExternalLink } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/Timeago';
import { EnableChip } from '@signalco/ui/EnableChip';
import { camelToSentenceCase } from '@signalco/js';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import { entityLastActivity } from '../../../src/entity/EntityHelper';
import { setAsync } from '../../../src/contacts/ContactRepository';
import EntityOptions from '../../../components/views/Entity/EntityOptions';
import BatteryIndicator from '../../../components/indicators/BatteryIndicator';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import EntityStatus, { useEntityStatus } from '../../../components/entity/EntityStatus';
import { useEntityBattery } from '../../../components/entity/EntityBattery';

// TODO: Make server-side page

export default function EntityLayout({ children }: PropsWithChildren) {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const { data: entity } = useEntity(id);
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);

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

    return (
        <div className="flex flex-col">
            <Stack className="px-2 py-1" spacing={1}>
                <Row spacing={1} justifyContent="space-between">
                    <Row spacing={1}>
                        {(hasStatus && (isStale || isOffline)) && (
                            <Chip>
                                <EntityStatus entity={entity} />
                                <Timeago date={entityLastActivity(entity)} />
                            </Chip>
                        )}
                        {hasBattery &&
                            <Chip>
                                <BatteryIndicator level={level} size="sm" />
                                {`${level}%`}
                            </Chip>
                        }
                        {(!disabledContact.isLoading && !disabledContact.error) && (
                            <EnableChip enabled={!isDisabled} onClick={handleDisableToggle} />
                        )}
                        <ShareEntityChip entity={entity} entityType={1} />
                        {visitLinks?.map(link => (
                            <Chip key={link.href} href={link.href} startDecorator={<ExternalLink size={16} />}>{link.alias}</Chip>
                        ))}
                    </Row>
                    <Suspense>
                        <EntityOptions id={id} />
                    </Suspense>
                </Row>
            </Stack>
            <div className="px-2">
                {children}
            </div>
        </div>
    );
}
