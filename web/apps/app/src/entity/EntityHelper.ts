import { arrayMax } from '@signalco/js';
import IEntityDetails from './IEntityDetails'

export const entityTypes = [
    { value: 1, label: 'Device' },
    { value: 2, label: 'Dashboard' },
    { value: 3, label: 'Process' },
    { value: 4, label: 'Station' },
    { value: 5, label: 'Channel' }
];

export function entityBatteryLevel(entity: IEntityDetails | null | undefined) {
    return parseFloat(entity?.contacts.find(c => c.contactName === 'battery')?.valueSerialized ?? '');
}

export function entityHasOffline(entity: IEntityDetails | null | undefined) {
    if (entity == null) return false;
    return Boolean(entity.contacts.find(c => c.contactName === 'offline'));
}

export function entityInError(entity: IEntityDetails | null | undefined) {
    if (entity == null) return false;
    const offlineContacts = entity.contacts.filter(c => c.contactName === 'offline');
    if ((offlineContacts?.length ?? 0) <= 0) return undefined;
    return Boolean(offlineContacts.find(c => c.valueSerialized?.toLocaleLowerCase() === 'true'));
}

export function entityLastActivity(entity: IEntityDetails | null | undefined) {
    if (entity == null) return new Date(0);
    const maxTimeStamp = arrayMax<Date | undefined>(entity.contacts.map(c => c.timeStamp), d => d?.getTime());
    if (maxTimeStamp)
        return new Date(maxTimeStamp);
    return undefined;
}
