import { IObservableArray, isObservable, makeAutoObservable, observable, runInAction } from "mobx";
import { widgetType } from "../../components/widgets/Widget";
import { IUser, SignalUserDto } from "../devices/Device";
import EntityRepository from "../entity/EntityRepository";
import HttpService from "../services/HttpService";
import LocalStorageService from "../services/LocalStorageService";

export interface IDashboardSetModel {
    configurationSerialized?: string;
    name: string;
    id?: string;
}

export interface IWidget {
    id: string,
    type: widgetType,
    config?: object,
    setConfig: (newConfig: object | undefined) => void
}

export interface IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
}

class DashboardModel implements IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];

    constructor(id: string, name: string, configurationSerialized: string | undefined, sharedWith: IUser[], timeStamp: Date | undefined) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
        this.timeStamp = timeStamp;
        this.isFavorite = false;
        this.widgets = [];
        this.sharedWith = sharedWith;

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
    sharedWith?: SignalUserDto[];
    timeStamp?: string;

    static FromDto(dto: SignalDashboardDto): IDashboardModel {
        if (dto.id == null || dto.name == null) {
            throw Error("Invalid SignalDashboardDto - missing required properties.");
        }

        return new DashboardModel(
            dto.id,
            dto.name,
            dto.configurationSerialized,
            dto.sharedWith?.map(SignalUserDto.FromDto) ?? [],
            dto.timeStamp ? new Date(dto.timeStamp + "Z") : undefined);
    }
}

const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';

export default class DashboardsRepository {
    private static _dashboardsCache: IObservableArray<IDashboardModel> = observable.array([]);
    private static isLoaded: boolean;

    static isLoading: boolean;
    private static _isUpdateAvailable: {state: boolean} = observable({state: false});
    static get isUpdateAvailable() {
        return DashboardsRepository._isUpdateAvailable.state;
    };
    private static set isUpdateAvailable(state: boolean) {
        runInAction(()=> {
            DashboardsRepository._isUpdateAvailable.state = state;
        });
    }
    static get dashboards() {
        DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository._dashboardsCache;
    };

    static async getAsync(id: string) {
        await DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository._dashboardsCache.find(d => d.id === id);
    }

    static async favoriteSetAsync(id: string, newIsFavorite: boolean) {
        const currentFavorites = LocalStorageService.getItem<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const currentFavoriteIndex = currentFavorites.indexOf(id);
        const isCurrentlyFavorite = currentFavoriteIndex >= 0;

        // Set or remove
        if (!isCurrentlyFavorite && newIsFavorite) {
            LocalStorageService.setItem(DashboardsFavoritesLocalStorageKey, [...currentFavorites, id]);
        } else if (isCurrentlyFavorite && !newIsFavorite) {
            let newFavorites = [...currentFavorites];
            newFavorites.splice(currentFavoriteIndex, 1)
            LocalStorageService.setItem(DashboardsFavoritesLocalStorageKey, newFavorites);
        }

        // Mark favorite locally
        const favoritedDashboard = DashboardsRepository._dashboardsCache.find(d => d.id === id);
        if (favoritedDashboard) {
            favoritedDashboard.isFavorite = newIsFavorite;
        }
    }

    static async saveDashboardAsync(dashboard: IDashboardSetModel) {
        const dashboardId = await DashboardsRepository._setRemoteDashboardAsync(dashboard);
        await DashboardsRepository._applyRemoteDashboardsAsync();
        return dashboardId;
    }

    static async deleteDashboardAsync(id: string) {
        await EntityRepository.deleteAsync(id, 3);
        await DashboardsRepository._applyRemoteDashboardsAsync();
    }

    static async isUpdateAvailableAsync() {
        await DashboardsRepository._checkUpdatesAvailableAsync();
        return DashboardsRepository.isUpdateAvailable;
    }

    static async applyDashboardsUpdateAsync() {
        await DashboardsRepository._applyRemoteDashboardsAsync();
    }

    private static _cacheLock = false;

    private static async _cacheDashboardsAsync() {
        if (DashboardsRepository.isLoaded) return;

        try {
            if (!DashboardsRepository._cacheLock) {
                DashboardsRepository._cacheLock = true;

                console.debug('Loading dashboards...');

                // Try to load from local storage
                if (!DashboardsRepository.isLoading &&
                    typeof localStorage !== 'undefined' &&
                    LocalStorageService.getItem('signalco-cache-dashboards') !== null) {
                    DashboardsRepository.isLoading = true;

                    // Load from local storage
                    try {
                        const localDashboards = LocalStorageService.getItem<IDashboardModel[]>('signalco-cache-dashboards', []);
                        DashboardsRepository._mapAndApplyDashboards(localDashboards);
                        DashboardsRepository.isLoading = false;
                        DashboardsRepository.isLoaded = true;
                    }
                    catch (err) {
                        console.error("Failed to load dashboards from local storage", err);
                    }
                }

                // TODO: Invalidate cache after some period
                if (DashboardsRepository.isLoading &&
                    !DashboardsRepository.isLoaded) {
                    await DashboardsRepository._applyRemoteDashboardsAsync();
                }
            } else {
                // Wait to load
                while (DashboardsRepository.isLoading) {
                    await new Promise(r => setTimeout(r, 10));
                }
            }
        }
        finally {
            DashboardsRepository._cacheLock = false;
        }
    }

    private static async _checkUpdatesAvailableAsync() {
        console.debug("Checking for dashboard updates...");

        const remoteDashboards = await DashboardsRepository._getRemoteDahboardsAsync();

        // Check added or updated dashboards
        remoteDashboards.forEach(remoteDashboard => {
            const localDashboard = DashboardsRepository._dashboardsCache.find(d => d.id == remoteDashboard.id);
            if (localDashboard == null ||
                remoteDashboard.timeStamp == null ||
                localDashboard.timeStamp == null ||
                localDashboard.timeStamp < remoteDashboard.timeStamp) {
                DashboardsRepository.isUpdateAvailable = true;
                console.debug("Dashboard update available. Dashboard: ", remoteDashboard.name, localDashboard?.timeStamp, "<", remoteDashboard.timeStamp)
            }
        });

        // Check deleted dashboards
        DashboardsRepository._dashboardsCache.forEach(localDashboard => {
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
        const newDashboards = await DashboardsRepository._getRemoteDahboardsAsync();
        newDashboards.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        DashboardsRepository._mapAndApplyDashboards(newDashboards);
        DashboardsRepository.isLoading = false;

        // Persist dashboards locally
        if (typeof localStorage !== 'undefined') {
            LocalStorageService.setItem('signalco-cache-dashboards', DashboardsRepository._dashboardsCache);
        }
    }

    private static async _mapAndApplyDashboards(dashboards: IDashboardModel[]) {
        const favorites = LocalStorageService.getItem<string[]>(DashboardsFavoritesLocalStorageKey, []);
        DashboardsRepository._dashboardsCache.replace(dashboards.map(d => {
            d.timeStamp = d.timeStamp ? (typeof d.timeStamp === 'string' ? new Date(d.timeStamp) : d.timeStamp) : undefined;
            d.isFavorite = favorites.indexOf(d.id) >= 0;
            d.widgets = (typeof d.configurationSerialized !== 'undefined' && d.configurationSerialized != null
                    ? JSON.parse(d.configurationSerialized).widgets as Array<IWidget>
                    : [])
                .map((w, i) => ({ ...w, id: i.toString() }));
            return isObservable(d) ? d : makeAutoObservable(d);
        }));
    }

    private static async _setRemoteDashboardAsync(dashboard: IDashboardSetModel): Promise<string> {
        const response = await HttpService.requestAsync("/dashboards/set", "post", SignalDashboardSetDto.ToDto(dashboard));
        return response.id;
    }

    private static async _getRemoteDahboardsAsync() {
        return (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);
    }
}