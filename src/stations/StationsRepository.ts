import ConductsService from '../conducts/ConductsService';
import EntityRepository from '../entity/EntityRepository';
import HttpService from '../services/HttpService';

export interface IStationModel {
    id: string;
    version?: string;
    stateTimeStamp?: Date;
    registeredTimeStamp: Date;
    availableWorkerServices?: string[];
    runningWorkerServices?: string[];
}

class StationModel implements IStationModel {
    id: string;
    version?: string;
    stateTimeStamp?: Date;
    registeredTimeStamp: Date;
    availableWorkerServices?: string[];
    runningWorkerServices?: string[];

    constructor(id: string, registeredTimeStamp: Date) {
        this.id = id;
        this.registeredTimeStamp = registeredTimeStamp;
    }
}

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

class SignalStationDto {
    id?: string;
    registeredTimeStamp?: string;
    version?: string;
    stateTimeStamp?: Date;
    availableWorkerServices?: string[];
    runningWorkerServices?: string[];

    static FromDto(dto: SignalStationDto): IStationModel {
        if (dto.id == null || dto.registeredTimeStamp == null) {
            throw Error('Invalid SignalBeaconDto - missing required properties.');
        }

        const model = new StationModel(dto.id, new Date(dto.registeredTimeStamp));
        model.version = dto.version;
        model.stateTimeStamp = dto.stateTimeStamp;
        model.availableWorkerServices = dto.availableWorkerServices;
        model.runningWorkerServices = dto.runningWorkerServices;
        return model;
    }
}

export default class StationsRepository {
    static stationsCache?: IStationModel[];
    static stationsCacheKeyed?: { [id: string]: IStationModel };
    static isLoading: boolean;

    static async deleteAsync(id: string) {
        await EntityRepository.deleteAsync(id, 4);
        // TODO: Reload cache or remove item from local cache
    }

    static async updateStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'update'});
    }

    static async updateSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'updateSystem'});
    }

    static async restartSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'restartSystem'});
    }

    static async shutdownSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'shutdownSystem'});
    }

    static async restartStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'restartStation'});
    }

    static async startWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'workerService:start'}, workerServiceName);
    }

    static async stopWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'workerService:stop'}, workerServiceName);
    }

    static async beginDiscoveryAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: 'station', contactName: 'beginDiscovery'});
    }

    static async getLogsAsync(id: string) {
        return (await HttpService.getAsync<StationBlobInfoDto[]>(`/stations/logging/list?stationId=${id}`)).map(StationBlobInfoDto.FromDto);
    }

    static async getStationAsync(id: string): Promise<IStationModel | undefined> {
        await StationsRepository._cacheStationsAsync();
        if (typeof StationsRepository.stationsCacheKeyed !== 'undefined') {
            if (typeof StationsRepository.stationsCacheKeyed[id] === 'undefined')
                return undefined;
            return StationsRepository.stationsCacheKeyed[id];
        }
        return undefined;
    }

    static async getStationsAsync(): Promise<IStationModel[]> {
        await StationsRepository._cacheStationsAsync();
        return StationsRepository.stationsCache ?? [];
    }

    static async _cacheStationsAsync() {
        // TODO: Invalidate cache after some period
        if (!StationsRepository.isLoading &&
            !StationsRepository.stationsCache) {
            StationsRepository.isLoading = true;
            StationsRepository.stationsCache = (await HttpService.getAsync<SignalStationDto[]>('/beacons')).map(SignalStationDto.FromDto);
            StationsRepository.stationsCacheKeyed = {};
            StationsRepository.stationsCache.forEach(process => {
                if (StationsRepository.stationsCacheKeyed)
                    StationsRepository.stationsCacheKeyed[process.id] = process;
            });
            StationsRepository.stationsCache.sort((a, b) => a.id < b.id ? -1 : (a.id > b.id ? 1 : 0));
            StationsRepository.isLoading = false;
        }

        // Wait to load
        while (StationsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}