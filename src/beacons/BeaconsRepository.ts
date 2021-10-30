import ConductsService from "../conducts/ConductsService";
import HttpService from "../services/HttpService";

export interface IBeaconModel {
    id: string;
    version?: string;
    stateTimeStamp?: Date;
    registeredTimeStamp: Date;
    availableWorkerServices?: string[];
    runningWorkerServices?: string[];
}

class BeaconModel implements IBeaconModel {
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

class SignalBeaconDto {
    id?: string;
    registeredTimeStamp?: string;
    version?: string;
    stateTimeStamp?: Date;
    availableWorkerServices?: string[];
    runningWorkerServices?: string[];

    static FromDto(dto: SignalBeaconDto): IBeaconModel {
        if (dto.id == null || dto.registeredTimeStamp == null) {
            throw Error("Invalid SignalBeaconDto - missing required properties.");
        }

        const model = new BeaconModel(dto.id, new Date(dto.registeredTimeStamp));
        model.version = dto.version;
        model.stateTimeStamp = dto.stateTimeStamp;
        model.availableWorkerServices = dto.availableWorkerServices;
        model.runningWorkerServices = dto.runningWorkerServices;
        return model;
    }
}

export default class BeaconsRepository {
    static beaconsCache?: IBeaconModel[];
    static beaconsCacheKeyed?: { [id: string]: IBeaconModel };
    static isLoading: boolean;

    static async updateBeaconAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "update"});
    }

    static async updateSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "updateSystem"});
    }

    static async restartSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "restartSystem"});
    }

    static async shutdownSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "shutdownSystem"});
    }

    static async restartStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "restartStation"});
    }

    static async startWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "workerService:start"}, workerServiceName);
    }

    static async stopWorkerServiceAsync(id: string, workerServiceName: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "workerService:stop"}, workerServiceName);
    }

    static async beginDiscoveryAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "beginDiscovery"});
    }

    static async getBeaconAsync(id: string): Promise<IBeaconModel | undefined> {
        await BeaconsRepository._cacheBeaconsAsync();
        if (typeof BeaconsRepository.beaconsCacheKeyed !== 'undefined') {
            if (typeof BeaconsRepository.beaconsCacheKeyed[id] === "undefined")
                return undefined;
            return BeaconsRepository.beaconsCacheKeyed[id];
        }
        return undefined;
    }

    static async getBeaconsAsync(): Promise<IBeaconModel[]> {
        await BeaconsRepository._cacheBeaconsAsync();
        return BeaconsRepository.beaconsCache ?? [];
    }

    static async _cacheBeaconsAsync() {
        // TODO: Invalidate cache after some period        
        if (!BeaconsRepository.isLoading &&
            !BeaconsRepository.beaconsCache) {
            BeaconsRepository.isLoading = true;
            BeaconsRepository.beaconsCache = (await HttpService.getAsync<SignalBeaconDto[]>("/beacons")).map(SignalBeaconDto.FromDto);
            BeaconsRepository.beaconsCacheKeyed = {};
            BeaconsRepository.beaconsCache.forEach(process => {
                if (BeaconsRepository.beaconsCacheKeyed)
                    BeaconsRepository.beaconsCacheKeyed[process.id] = process;
            });
            BeaconsRepository.beaconsCache.sort((a, b) => a.id < b.id ? -1 : (a.id > b.id ? 1 : 0));
            BeaconsRepository.isLoading = false;
        }

        // Wait to load
        while (BeaconsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}