import { makeAutoObservable } from 'mobx';
import HttpService from '../services/HttpService';

export interface IProcessModel extends IProcessUpdateModel {
    setConfiguration(configurationSerialized: string) : void;
}

export interface IProcessUpdateModel extends IProcessCreateModel {
    id: string;
}

export interface IProcessCreateModel {
    configurationSerialized?: string | undefined;
    isDisabled: boolean;
    alias: string;
    type: string;
}

export class ProcessModel implements IProcessModel {
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

        makeAutoObservable(this);
    }

    setConfiguration(configurationSerialized: string) {
        this.configurationSerialized = configurationSerialized;
    }

    static create(): IProcessCreateModel {
        return {
            alias: 'New process',
            isDisabled: false,
            type: 'StateTriggered'
        };
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
            throw Error('Invalid SignalProcessDto - missing required properties.');
        }

        return new ProcessModel(dto.type, dto.id, dto.alias, dto.isDisabled ?? false, dto.configurationSerialized);
    }
}

export class ProcessesRepository {
    private processesCache?: IProcessModel[];
    private processesCacheKeyed?: { [id: string]: IProcessModel };
    private isLoading: boolean = false;


    constructor() {
        this.cacheProcessesAsync = this.cacheProcessesAsync.bind(this);
        this.getProcessAsync = this.getProcessAsync.bind(this);
        this.saveProcessAsync = this.saveProcessAsync.bind(this);
        this.getProcessesAsync = this.getProcessesAsync.bind(this);
    }


    async saveProcessAsync(process: IProcessCreateModel | IProcessUpdateModel) {
        const response = await HttpService.requestAsync('/processes/set', 'post', process) as {id: string} | undefined;
        return response?.id;
    }

    async saveProcessConfigurationAsync(id: string, configurationSerialized: string) {
        const process = await this.getProcessAsync(id);
        if (process == null)
            throw new Error('Invalid process identifier.');

        process.setConfiguration(configurationSerialized);

        await this.saveProcessAsync(process);
    }

    async getProcessAsync(id: string): Promise<IProcessModel | undefined> {
        await this.cacheProcessesAsync();
        if (typeof this.processesCacheKeyed !== 'undefined') {
            if (typeof this.processesCacheKeyed[id] === 'undefined')
                return undefined;
            return this.processesCacheKeyed[id];
        }
        return undefined;
    }

    async getProcessesAsync(): Promise<IProcessModel[]> {
        await this.cacheProcessesAsync();
        return this.processesCache ?? [];
    }

    private async cacheProcessesAsync() {
        // Wait to load
        if (this.isLoading) {
            do {
                await new Promise(r => setTimeout(r, 10));
            } while (this.isLoading);
        }

        // TODO: Invalidate cache after some period
        if (!this.isLoading &&
            !this.processesCache) {
                this.isLoading = true;
                this.processesCache = (await HttpService.getAsync<SignalProcessDto[]>('/processes')).map(SignalProcessDto.FromDto);
                this.processesCacheKeyed = {};
                this.processesCache.forEach(process => {
                if (this.processesCacheKeyed)
                this.processesCacheKeyed[process.id] = process;
            });
            this.processesCache.sort((a, b) => a.alias.toLowerCase() < b.alias.toLowerCase() ? -1 : (a.alias.toLowerCase() > b.alias.toLowerCase() ? 1 : 0));
            this.isLoading = false;
        }
    }
}

const instance = new ProcessesRepository();

export default instance;
