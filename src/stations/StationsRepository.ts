import IEntityDetails from 'src/entity/IEntityDetails';
import ConductsService from '../conducts/ConductsService';
import { entitiesAsync, entityAsync, entityDeleteAsync } from '../entity/EntityRepository';
import HttpService from '../services/HttpService';

class StationBlobInfoDto {
    name?: string;
    createdTimeStamp?: string;
    modifiedTimeStamp?: string;
    size?: number;

    static FromDto(dto: StationBlobInfoDto): IBlobInfoModel {
        if (dto.name == null || dto.createdTimeStamp == null || dto.size == null) {
            throw Error('Invalid StationBlobInfoDto - missing required properties.');
        }

        return new BlobInfoModel(dto.name, new Date(dto.createdTimeStamp), dto.modifiedTimeStamp ? new Date(dto.modifiedTimeStamp) : undefined, dto.size);
    }
}

export interface IBlobInfoModel {
    name: string;
    createdTimeStamp: Date;
    modifiedTimeStamp?: Date;
    size: number;
}

class BlobInfoModel implements IBlobInfoModel {
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

export default class StationsRepository {
    static isLoading: boolean;

    static async deleteAsync(id: string) {
        await entityDeleteAsync(id);
    }

    static async updateStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'update'});
    }

    static async updateSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'updateSystem'});
    }

    static async restartSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'restartSystem'});
    }

    static async shutdownSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'shutdownSystem'});
    }

    static async restartStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'restartStation'});
    }

    static async startWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'workerService:start'}, workerServiceName);
    }

    static async stopWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'workerService:stop'}, workerServiceName);
    }

    static async beginDiscoveryAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({entityId: id, channelName: 'station', contactName: 'beginDiscovery'});
    }

    static async getLogsAsync(id: string) {
        return (await HttpService.getAsync<StationBlobInfoDto[]>(`/stations/logging/list?stationId=${id}`)).map(StationBlobInfoDto.FromDto);
    }

    static async getStationAsync(id: string): Promise<IEntityDetails | undefined> {
        return await entityAsync(id);
    }

    static async getStationsAsync(): Promise<IEntityDetails[]> {
        return await entitiesAsync(4);
    }
}
