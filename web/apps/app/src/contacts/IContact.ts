
export type ContactMetadataV1 = {
    Version: 1;
    ProcessSameValue?: boolean;
    PersistHistory?: boolean;
};

export default interface IContact {
    entityId: string;
    channelName: string;
    contactName: string;
    timeStamp: Date | undefined;
    valueSerialized: string | undefined;
    metadata?: ContactMetadataV1;
}
