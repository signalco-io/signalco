import DateTimeProvider from 'src/services/DateTimeProvider';
import HttpService from 'src/services/HttpService';
import IContactPointer from './IContactPointer';

interface TimeStampValuePairDto {
    timeStamp: string;
    valueSerialized: string | undefined;
}

interface ContactHistoryResponseDto {
    values: TimeStampValuePairDto[]
}

class ContactRepository {
    async setAsync(pointer: IContactPointer, valueSerialized: string | undefined, timeStamp?: Date | undefined) {
        await HttpService.requestAsync('/contact/set', 'post', {
            entityId: pointer.entityId,
            contactName: pointer.contactName,
            channelName: pointer.channelName,
            valueSerialized: valueSerialized,
            timeStamp: timeStamp?.toISOString()
        });
    }

    async historyAsync(pointer: IContactPointer, duration: Date | string) {
        return (await HttpService.requestAsync('/contact/history', 'get', {
            entityId: pointer.entityId,
            contactName: pointer.contactName,
            channelName: pointer.channelName,
            duration: typeof duration === 'string' ? duration : DateTimeProvider.toDuration(duration)
        }) as ContactHistoryResponseDto).values.map(tsvp => ({
            timeStamp: new Date(tsvp.timeStamp),
            valueSerialized: tsvp.valueSerialized
        }));
    }
}

const instance = new ContactRepository();

export default instance;
