import { requestAsync } from '../services/HttpService';
import { toDuration } from '../services/DateTimeProvider';
import IContactPointer from './IContactPointer';

export interface ContactHistoryItem {
    timeStamp: Date;
    valueSerialized: string | undefined;
}

interface TimeStampValuePairDto {
    timeStamp: string;
    valueSerialized: string | undefined;
}

interface ContactHistoryResponseDto {
    values: TimeStampValuePairDto[]
}

export async function setMetadataAsync(pointer: IContactPointer, metadataSerialized: string | undefined) {
    await requestAsync('/contact/metadata', 'post', {
        entityId: pointer.entityId,
        contactName: pointer.contactName,
        channelName: pointer.channelName,
        metadata: metadataSerialized
    });
}

export async function setAsync(pointer: IContactPointer, valueSerialized: string | undefined, timeStamp?: Date | undefined) {
    await requestAsync(`/entity/${pointer.entityId}/contacts/${pointer.channelName}/${pointer.contactName}`, 'put', {
        valueSerialized: valueSerialized,
        timeStamp: timeStamp?.toISOString()
    });
}

export async function deleteContactAsync(pointer: IContactPointer) {
    await requestAsync(`/entity/${pointer.entityId}/contacts/${pointer.channelName}/${pointer.contactName}`, 'delete');
}

export async function historiesAsync(targets: IContactPointer[] | undefined, duration: number) {
    const contactsHistory = targets?.map(async t => ({ contact: t, history: await historyAsync(t, duration) }));
    if (contactsHistory) {
        return await Promise.all(contactsHistory);
    }
    return [];
}

export async function historyAsync(pointer: IContactPointer, duration?: Date | string | number | undefined) {
    const params = {
        entityId: pointer.entityId,
        channelName: pointer.channelName,
        contactName: pointer.contactName,
    };
    const optionalParams = new Map<string, string>();
    const durationParam = typeof duration === 'string' || typeof duration === 'undefined' || typeof duration === 'number'
        ? duration?.toString()
        : toDuration(duration);
    if (durationParam) {
        optionalParams.set('duration', durationParam);
    }

    return (await requestAsync('/contact/history', 'get', {
        ...params,
        ...optionalParams.entries
    }) as ContactHistoryResponseDto).values.map(tsvp => ({
        timeStamp: new Date(tsvp.timeStamp),
        valueSerialized: tsvp.valueSerialized
    }) as ContactHistoryItem);
}
