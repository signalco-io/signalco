import HttpService from "../services/HttpService";

export interface IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
}

class DashboardModel implements IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;

    constructor(id: string, name: string, configurationSerialized?: string, timeStamp?: Date) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
        this.timeStamp = timeStamp;
    }
}

class SignalDashboardDto {
    id?: string;
    name?: string;
    configurationSerialized?: string;
    timeStamp?: string;

    static FromDto(dto: SignalDashboardDto): IDashboardModel {
        if (dto.id == null || dto.name == null) {
            throw Error("Invalid SignalDashboardDto - missing required properties.");
        }

        return new DashboardModel(dto.id, dto.name, dto.configurationSerialized, dto.timeStamp ? new Date(dto.timeStamp) : undefined);
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

    static async isUpdateAvailableAsync() {
        await DashboardsRepository._checkUpdatesAvailableAsync();
        return DashboardsRepository.isUpdateAvailable;
    }

    static async applyDashboardsUpdateAsync() {
        await DashboardsRepository._applyRemoteDashboardsAsync();
    }

    private static async _cacheDashboardsAsync() {
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
            await DashboardsRepository._applyRemoteDashboardsAsync();
        }

        // Wait to load
        while (DashboardsRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    private static async _checkUpdatesAvailableAsync() {
        const remoteDashboards = await DashboardsRepository._getRemoteDahboardsAsync();
        remoteDashboards.forEach(remoteDashboard => {
            const localDashboard = DashboardsRepository.dashboardsCache?.find(d => d.id == remoteDashboard.id);
            if (localDashboard == null || 
                remoteDashboard.timeStamp == null ||
                localDashboard.timeStamp == null ||
                localDashboard.timeStamp < remoteDashboard.timeStamp) {
                DashboardsRepository.isUpdateAvailable = true;
                console.debug("Dashboard update available. Dashboard: ", remoteDashboard.name, localDashboard?.timeStamp, "<", remoteDashboard.timeStamp)
            }
        });
    }

    private static async _applyRemoteDashboardsAsync() {
        DashboardsRepository.isLoading = true;

        // Download cache
        DashboardsRepository.dashboardsCache = await DashboardsRepository._getRemoteDahboardsAsync();;            
        DashboardsRepository.dashboardsCache.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        DashboardsRepository.isLoading = false;

        // Persist dashboards locally
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('signalco-cache-dashboards', JSON.stringify(DashboardsRepository.dashboardsCache));
        }
    }

    private static async _getRemoteDahboardsAsync() {
        return (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);
    }
}