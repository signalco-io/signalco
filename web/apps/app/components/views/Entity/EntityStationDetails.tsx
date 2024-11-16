import { useState, Fragment } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Card, CardContent, CardHeader } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import EntityStatus from '../../entity/EntityStatus';
import useContact from '../../../src/hooks/signalco/useContact';
import type IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import ConductsService from '../../../src/conducts/ConductsService';

function ContactButton({ pointer }: { pointer: IContactPointer }) {
    const { data: contact, isLoading, error } = useContact(pointer);
    const [executing, setExecuting] = useState(false);

    const handleContactAction = async () => {
        try {
            setExecuting(true);
            await ConductsService.RequestMultipleConductAsync([
                { pointer, delay: 0 },
            ]);
        } catch (err) {
            console.warn('Failed to execute conduct', err);
            showNotification('Failed to execute conduct', 'error');
        } finally {
            setExecuting(false);
        }
    };

    if (!contact || isLoading || error) {
        return null;
    }

    return (
        <Button onClick={handleContactAction} loading={executing}>{contact.contactName}</Button>
    )
}

function stationPointer(entity: IEntityDetails, contactName: string) {
    return { entityId: entity.id, channelName: 'station', contactName };
}

export default function EntityStationDetails({ entity }: { entity: IEntityDetails }) {
    const infos = [
        { label: 'Status', value: <EntityStatus entity={entity} /> },
        { label: 'Version', value: entity.contacts.find(c => c.channelName === 'signalco' && c.contactName === 'version')?.valueSerialized },
    ];

    return (
        <div className="flex gap-2">
            <Card>
                <CardHeader>Info</CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-1">
                        {infos.map(info => (
                            <Fragment key={info.label}>
                                <label>{info.label}</label>
                                <div>{info.value}</div>
                            </Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>Actions</CardHeader>
                <CardContent>
                    <Stack>
                        <ContactButton pointer={stationPointer(entity, 'restartStation')} />
                        <ContactButton pointer={stationPointer(entity, 'restartSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'shutdownSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'update')} />
                        <ContactButton pointer={stationPointer(entity, 'updateSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'workerService:start')} />
                        <ContactButton pointer={stationPointer(entity, 'workerService:stop')} />
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}
