import { makeAutoObservable } from "mobx";
import { IWidget } from "../../components/dashboards/Dashboards";
import HttpService from "../services/HttpService";
import LocalStorageService from "../services/LocalStorageService";

export interface IDashboardSetModel {
    configurationSerialized?: string;
    name: string;
    id?: string;
}

export interface IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
}

class DashboardModel implements IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];

    constructor(id: string, name: string, configurationSerialized?: string, timeStamp?: Date) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
        this.timeStamp = timeStamp;
        this.isFavorite = false;
        this.widgets = [];

        makeAutoObservable(this);
    }
}

export class DashboardSetModel implements IDashboardSetModel {
    configurationSerialized?: string | undefined;
    name: string;
    id?: string | undefined;

    constructor(name: string) {
        this.name = name;
    }
}

class SignalDashboardSetDto {
    id?: string;
    name: string;
    configurationSerialized?: string;

    constructor(name: string) {
        this.name = name;
    }

    static ToDto(model: IDashboardSetModel) {
        if (typeof model.name !== 'string' || model.name.length <= 0) {
            throw Error("Invalid SignalDashboardSetDto - must have name.");
        }

        const dto = new SignalDashboardSetDto(model.name);
        dto.id = model.id;
        dto.configurationSerialized = model.configurationSerialized;
        return dto;
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

        return new DashboardModel(dto.id, dto.name, dto.configurationSerialized, dto.timeStamp ? new Date(dto.timeStamp + "Z") : undefined);
    }
}

const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';

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

    static async favoriteSetAsync(id: string, newIsFavorite: boolean) {
        const currentFavorites = LocalStorageService.getItem<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const isCurrentlyFavorite = currentFavorites.indexOf(id) >= 0;

        console.log(!isCurrentlyFavorite, newIsFavorite)
        if (!isCurrentlyFavorite && newIsFavorite) {
            console.log('will set item', [...currentFavorites, id])
            LocalStorageService.setItem(DashboardsFavoritesLocalStorageKey, [...currentFavorites, id]);
        } else if (isCurrentlyFavorite && !newIsFavorite) {
            console.log('will remove item', [...currentFavorites, id])
            LocalStorageService.setItem(DashboardsFavoritesLocalStorageKey, currentFavorites.splice(currentFavorites.indexOf(id), 1));
        }

        // Mark favorite locally
        const favoritedDashboard = DashboardsRepository.dashboardsCache?.find(d => d.id === id);
        if (favoritedDashboard) {
            favoritedDashboard.isFavorite = newIsFavorite;
        }
    }

    static saveDashboardAsync(dashboard: IDashboardSetModel) {
        return DashboardsRepository._setRemoteDashboardAsync(dashboard);
    }

    static async deleteDashboardAsync(id: string) {
        await HttpService.requestAsync("/entity/delete", "delete", {id: id, entityType: 3});
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
            LocalStorageService.getItem('signalco-cache-dashboards') !== null) {
            DashboardsRepository.isLoading = true;

            const favorites = LocalStorageService.getItem<string[]>(DashboardsFavoritesLocalStorageKey, []);

            // Load from local storage
            try {
                DashboardsRepository.dashboardsCache = LocalStorageService
                    .getItem<IDashboardModel[]>('signalco-cache-dashboards', [])
                    .map(d => {
                        d.timeStamp = d.timeStamp ? new Date(d.timeStamp) : undefined;
                        d.isFavorite = favorites.indexOf(d.id) >= 0;
                        d.widgets = (typeof d.configurationSerialized !== 'undefined' && d.configurationSerialized != null
                                ? JSON.parse(d.configurationSerialized).widgets as Array<IWidget>
                                : [])
                            .map((w, i) => ({ ...w, id: i.toString() }));
                        return makeAutoObservable(d);
                    });
            }
            catch (err) {
                console.error("Failed to load dashboards from local storage", err);
            }

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

        // Check added or updated dashboards
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

        // Check deleted dashboards
        DashboardsRepository.dashboardsCache?.forEach(localDashboard => {
            const remoteDashboard = remoteDashboards.find(d => d.id === localDashboard.id);
            if (remoteDashboard == null) {
                DashboardsRepository.isUpdateAvailable = true;
                console.debug("Dashboard update available. Dashboard doesn't exist on remote: ", localDashboard.id, localDashboard.name);
            }
        });
    }

    private static async _applyRemoteDashboardsAsync() {
        DashboardsRepository.isLoading = true;

        // Download cache
        DashboardsRepository.dashboardsCache = await DashboardsRepository._getRemoteDahboardsAsync();
        DashboardsRepository.dashboardsCache.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        DashboardsRepository.isLoading = false;

        // Persist dashboards locally
        if (typeof localStorage !== 'undefined') {
            LocalStorageService.setItem('signalco-cache-dashboards', DashboardsRepository.dashboardsCache);
        }
    }

    private static async _setRemoteDashboardAsync(dashboard: IDashboardSetModel): Promise<string> {
        const response = await HttpService.requestAsync("/dashboards/set", "post", SignalDashboardSetDto.ToDto(dashboard));
        return response.id;
    }

    private static async _getRemoteDahboardsAsync() {
        return (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);
    }
}