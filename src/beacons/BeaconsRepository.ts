import ConductsService from "../conducts/ConductsService";
import HttpService from "../services/HttpService";

export interface IBeaconModel {
    id: string;
    version?: string;
    stateTimeStamp?: Date;
    registeredTimeStamp: Date;
}

class BeaconModel implements IBeaconModel {
    id: string;
    version?: string;
    stateTimeStamp?: Date;
    registeredTimeStamp: Date;

    constructor(id: string, registeredTimeStamp: Date, version?: string, stateTimeStamp?: Date) {
        this.id = id;
        this.registeredTimeStamp = registeredTimeStamp;
        this.version = version;
        this.stateTimeStamp = stateTimeStamp;
    }
}

class SignalBeaconDto {
    id?: string;
    registeredTimeStamp?: string;
    version?: string;
    stateTimeStamp?: Date;

    static FromDto(dto: SignalBeaconDto): IBeaconModel {
        if (dto.id == null || dto.registeredTimeStamp == null) {
            throw Error("Invalid SignalBeaconDto - missing required properties.");
        }

        return new BeaconModel(dto.id, new Date(dto.registeredTimeStamp), dto.version, dto.stateTimeStamp);
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

    static async shutdownSystemAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "shutdownSystem"});
    }

    static async restartStationAsync(id: string): Promise<void> {
        await ConductsService.RequestConductAsync({deviceId: id, channelName: "station", contactName: "restartStation"});
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