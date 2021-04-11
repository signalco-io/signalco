import HttpService from "../services/HttpService";

export interface IDashboardModel {
    configurationSerialized: string | undefined;
    isDisabled: boolean;
    alias: string;
    id: string;
    type: string;
}

class DashboardModel implements IDashboardModel {
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

class SignalDashboardDto {
    type?: string;
    id?: string;
    alias?: string;
    isDisabled?: boolean;
    configurationSerialized?: string;

    static FromDto(dto: SignalDashboardDto): IDashboardModel {
        if (dto.type == null || dto.id == null || dto.alias == null) {
            throw Error("Invalid SignalProcessDto - missing required properties.");
        }

        return new DashboardModel(dto.type, dto.id, dto.alias, dto.isDisabled ?? false, dto.configurationSerialized);
    }
}

export default class DashboardsRepository {
    static dashboardsCache?: IDashboardModel[];
    static dashboardsCacheKeyed?: { [id: string]: IDashboardModel };
    static isLoading: boolean;

    static async getDashboardAsync(id: string): Promise<IDashboardModel | undefined> {
        await DashboardsRepository._cacheDashboardsAsync();
        if (typeof DashboardsRepository.dashboardsCacheKeyed !== 'undefined') {
            if (typeof DashboardsRepository.dashboardsCacheKeyed[id] === "undefined")
                return undefined;
            return DashboardsRepository.dashboardsCacheKeyed[id];
        }
        return undefined;
    }

    static async getDashboardsAsync(): Promise<IDashboardModel[]> {
        await DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository.dashboardsCache ?? [];
    }

    static async _cacheDashboardsAsync() {
        // TODO: Invalidate cache after some period        
        if (!DashboardsRepository.isLoading &&
            !DashboardsRepository.dashboardsCache) {
                DashboardsRepository.isLoading = true;
                DashboardsRepository.dashboardsCache = (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);
                DashboardsRepository.dashboardsCacheKeyed = {};
                DashboardsRepository.dashboardsCache.forEach(process => {
                if (DashboardsRepository.dashboardsCacheKeyed)
                DashboardsRepository.dashboardsCacheKeyed[process.id] = process;
            });
            DashboardsRepository.dashboardsCache.sort((a, b) => a.alias < b.alias ? -1 : (a.alias > b.alias ? 1 : 0));
            DashboardsRepository.isLoading = false;
        }

        // Wait to load
        while (DashboardsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}