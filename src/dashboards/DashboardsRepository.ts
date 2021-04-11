import HttpService from "../services/HttpService";

export interface IDashboardModel {
    configurationSerialized: string | undefined;
    name: string;
    id: string;
}

class DashboardModel implements IDashboardModel {
    configurationSerialized: string | undefined;
    name: string;
    id: string;

    constructor(id: string, name: string, configurationSerialized?: string) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
    }
}

class SignalDashboardDto {
    id?: string;
    name?: string;
    configurationSerialized?: string;

    static FromDto(dto: SignalDashboardDto): IDashboardModel {
        if (dto.id == null || dto.name == null) {
            throw Error("Invalid SignalDashboardDto - missing required properties.");
        }

        return new DashboardModel(dto.id, dto.name, dto.configurationSerialized);
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
            DashboardsRepository.dashboardsCache.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            DashboardsRepository.isLoading = false;
        }

        // Wait to load
        while (DashboardsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}