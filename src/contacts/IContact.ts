export default interface IContact {
    entityId: string;
    channelName: string;
    contactName: string;
    timeStamp: Date | undefined;
    valueSerialized: string | undefined;
}
