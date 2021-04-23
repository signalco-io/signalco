import HttpService from "../services/HttpService";

export interface IBeaconModel {
    id: string;
    registeredTimeStamp: Date;
}

class BeaconModel implements IBeaconModel {
    id: string;
    registeredTimeStamp: Date;

    constructor(id: string, registeredTimeStamp: Date) {
        this.id = id;
        this.registeredTimeStamp = registeredTimeStamp;
    }
}

class SignalBeaconDto {
    id?: string;
    registeredTimeStamp?: string;

    static FromDto(dto: SignalBeaconDto): IBeaconModel {
        if (dto.id == null || dto.registeredTimeStamp == null) {
            throw Error("Invalid SignalBeaconDto - missing required properties.");
        }

        return new BeaconModel(dto.id, new Date(dto.registeredTimeStamp));
    }
}

export default class BeaconsRepository {
    static beaconsCache?: IBeaconModel[];
    static beaconsCacheKeyed?: { [id: string]: IBeaconModel };
    static isLoading: boolean;

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