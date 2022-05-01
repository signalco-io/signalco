import IBlobInfoModel from './IBlobInfoModel';

export default class BlobInfoModel implements IBlobInfoModel {
    name: string;
    createdTimeStamp: Date;
    modifiedTimeStamp?: Date;
    size: number;

    constructor(name: string, createdTimeStamp: Date, modifiedTimeStamp: Date | undefined, size: number) {
        this.name = name;
        this.createdTimeStamp = createdTimeStamp;
        this.modifiedTimeStamp = modifiedTimeStamp;
        this.size = size;
    }
}
