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
    static isLoading: boolean;
    static isUpdateAvailable: boolean;

    static async getDashboardAsync(id: string): Promise<IDashboardModel | undefined> {
        await DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository.dashboardsCache?.find(i => i.id === id);
    }

    static async getDashboardsAsync(): Promise<IDashboardModel[]> {
        await DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository.dashboardsCache ?? [];
    }

    static async _cacheDashboardsAsync() {
        // Try to load from local storage
        if (!DashboardsRepository.isLoading && 
            !DashboardsRepository.dashboardsCache &&
            typeof localStorage !== 'undefined' &&
            localStorage.getItem('signalco-cache-dashboards') !== null) {
            DashboardsRepository.isLoading = true;

            // Load from local storage
            DashboardsRepository.dashboardsCache = JSON.parse(localStorage.getItem('signalco-cache-dashboards') ?? "[]") as IDashboardModel[];
            DashboardsRepository.isLoading = false;
        }

        // TODO: Invalidate cache after some period        
        if (!DashboardsRepository.isLoading &&
            !DashboardsRepository.dashboardsCache) {
            DashboardsRepository.isLoading = true;

            // Download cache
            DashboardsRepository.dashboardsCache = (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);            
            DashboardsRepository.dashboardsCache.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            DashboardsRepository.isLoading = false;

            // Persist dashboards locally
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('signalco-cache-dashboards', JSON.stringify(DashboardsRepository.dashboardsCache));
            }
        }

        // Wait to load
        while (DashboardsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}