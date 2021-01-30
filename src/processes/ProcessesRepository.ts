import HttpService from "../services/HttpService";

export interface IProcessModel {
    configurationSerialized: string | undefined;
    isDisabled: boolean;
    alias: string;
    id: string;
    type: string;
}

class ProcessModel implements IProcessModel {
    configurationSerialized: string | undefined;
    isDisabled: boolean;
    alias: string;
    id: string;
    type: string;

    constructor(type: string, id: string, alias: string, isDisabled: boolean, configurationSerialized?: string) {
        this.type = type;
        this.id = id;
        this.alias = alias;
        this.isDisabled = isDisabled;
        this.configurationSerialized = configurationSerialized;
    }
}

class SignalProcessDto {
    type?: string;
    id?: string;
    alias?: string;
    isDisabled?: boolean;
    configurationSerialized?: string;

    static FromDto(dto: SignalProcessDto): IProcessModel {
        if (dto.type == null || dto.id == null || dto.alias == null) {
            throw Error("Invalid SignalProcessDto - missing required properties.");
        }

        return new ProcessModel(dto.type, dto.id, dto.alias, dto.isDisabled ?? false, dto.configurationSerialized);
    }
}

export default class ProcessesRepository {
    static processesCache?: IProcessModel[];
    static processesCacheKeyed?: { [id: string]: IProcessModel };
    static isLoading: boolean;

    static async getProcessAsync(deviceId: string): Promise<IProcessModel | undefined> {
        await ProcessesRepository._cacheDevicesAsync();
        if (typeof ProcessesRepository.processesCacheKeyed !== 'undefined') {
            if (typeof ProcessesRepository.processesCacheKeyed[deviceId] === "undefined")
                return undefined;
            return ProcessesRepository.processesCacheKeyed[deviceId];
        }
        return undefined;
    }

    static async getProcessesAsync(): Promise<IProcessModel[]> {
        await ProcessesRepository._cacheDevicesAsync();
        return ProcessesRepository.processesCache ?? [];
    }

    static async _cacheDevicesAsync() {
        // TODO: Invalidate cache after some period        
        if (!ProcessesRepository.isLoading &&
            !ProcessesRepository.processesCache) {
            ProcessesRepository.isLoading = true;
            ProcessesRepository.processesCache = (await HttpService.getAsync<SignalProcessDto[]>("/processes")).map(SignalProcessDto.FromDto);
            ProcessesRepository.processesCacheKeyed = {};
            ProcessesRepository.processesCache.forEach(process => {
                if (ProcessesRepository.processesCacheKeyed)
                    ProcessesRepository.processesCacheKeyed[process.id] = process;
            });
            ProcessesRepository.processesCache.sort((a, b) => a.alias < b.alias ? -1 : (a.alias > b.alias ? 1 : 0));
            ProcessesRepository.isLoading = false;
        }

        // Wait to load
        while (ProcessesRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}