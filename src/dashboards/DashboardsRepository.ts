import { IObservableArray, isObservable, makeAutoObservable, observable, runInAction } from "mobx";
import { widgetType } from "../../components/widgets/Widget";
import { IUser, SignalUserDto } from "../devices/Device";
import EntityRepository from "../entity/EntityRepository";
import { arrayMax, orderBy, sequenceEqual } from "../helpers/ArrayHelpers";
import HttpService from "../services/HttpService";
import LocalStorageService from "../services/LocalStorageService";

export interface IDashboardSetModel {
    configurationSerialized?: string;
    name: string;
    id?: string;
}

export interface IWidget {
    id: string,
    order: number,
    type: widgetType,
    config?: object,
    setConfig: (newConfig: object | undefined) => void
}

export class WidgetModel implements IWidget {
    id: string;
    order: number;
    type: widgetType;
    config?: object | undefined;

    constructor(id: string, order: number, type: widgetType, config?: object | undefined) {
        this.id = id;
        this.order = order;
        this.type = type;
        this.config = config;
        makeAutoObservable(this);
    }

    setConfig(newConfig: object | undefined) {
        this.config = newConfig;
    }
}

export interface IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
    order: number;
}

class DashboardModel implements IDashboardModel {
    configurationSerialized?: string;
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
    order: number;

    constructor(id: string, name: string, configurationSerialized: string | undefined, sharedWith: IUser[], timeStamp: Date | undefined, order: number) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
        this.timeStamp = timeStamp;
        this.isFavorite = false;
        this.widgets = [];
        this.sharedWith = sharedWith;
        this.order = order;

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

    static FromDto(dto: SignalDashboardDto, order: number): IDashboardModel {
        if (dto.id == null || dto.name == null) {
            throw Error("Invalid SignalDashboardDto - missing required properties.");
        }

        const dashboard = new DashboardModel(
            dto.id,
            dto.name,
            dto.configurationSerialized,
            dto.sharedWith?.map(SignalUserDto.FromDto) ?? [],
            dto.timeStamp ? new Date(dto.timeStamp + "Z") : undefined,
            order);

        dashboard.widgets = (typeof dashboard.configurationSerialized !== 'undefined' && dashboard.configurationSerialized != null
                ? ((JSON.parse(dashboard.configurationSerialized).widgets ?? []) as Array<IWidget>).map(i => makeAutoObservable(i))
                : [])
            .map((w, i) => ({ ...w, id: i.toString() }));

        // Apply widget order
        let maxOrder = 0;
        for (let i = 0; i < dashboard.widgets.length; i++) {
            const w = dashboard.widgets[i];
            maxOrder = Math.max(maxOrder, w.order);
            if (typeof w.order === 'undefined'){
                console.debug('Widget has no order, applying default...');
                w.order = i;
            }
        }

        return dashboard;
    }
}

const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';
const DashboardsOrderLocalStorageKey = 'dashboards-order';

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

    static async getAsync(id: string | undefined) {
        if (typeof id === 'undefined')
            return undefined;

        await DashboardsRepository._cacheDashboardsAsync();
        return DashboardsRepository._dashboardsCache.find(d => d.id === id);
    }

    static async favoriteSetAsync(id: string, newIsFavorite: boolean) {
        const currentFavorites = LocalStorageService.getItemOrDefault<string[]>(DashboardsFavoritesLocalStorageKey, []);
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
        const favoritedDashboard = DashboardsRepository.dashboards.find(d => d.id === id);
        if (favoritedDashboard) {
            runInAction(() => {
                favoritedDashboard.isFavorite = newIsFavorite;
            });
        }
    }

    static async dashboardsOrderSetAsync(ordered: string[]) {
        LocalStorageService.setItem(DashboardsOrderLocalStorageKey, ordered);
    }

    static async saveDashboardsAsync(dashboards: IDashboardSetModel[]) {
        for (let i = 0; i < dashboards.length; i++) {
            await DashboardsRepository._setRemoteDashboardAsync(dashboards[i]);
        }
        await DashboardsRepository._applyRemoteDashboardsAsync();
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
                        const localDashboards = LocalStorageService.getItemOrDefault<IDashboardModel[]>('signalco-cache-dashboards', []);
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
                    await new Promise(r => setTimeout(r, 100));
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

        const widgetEquals = (a: IWidget, b: IWidget) => {
            return a.order === b.order &&
                a.id === b.id &&
                JSON.stringify(a.config) === JSON.stringify(b.config) &&
                a.type === b.type;
        };

        const userOrder = (a: IUser, b: IUser) => a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
        const userEquals = (a: IUser, b: IUser) => a.id === b.id;

        // Check added or updated dashboards
        remoteDashboards.forEach(remoteDashboard => {
            const localDashboard = DashboardsRepository._dashboardsCache.find(d => d.id == remoteDashboard.id);
            const sharedEqual = localDashboard != null && sequenceEqual(orderBy(remoteDashboard.sharedWith, userOrder), orderBy(localDashboard.sharedWith, userOrder), userEquals);
            const widgetsEqual = localDashboard != null && sequenceEqual(remoteDashboard.widgets, localDashboard.widgets, widgetEquals);
            if (localDashboard == null ||
                remoteDashboard.timeStamp == null ||
                localDashboard.timeStamp == null ||
                !sharedEqual ||
                !widgetsEqual ||
                localDashboard.timeStamp < remoteDashboard.timeStamp) {
                DashboardsRepository.isUpdateAvailable = true;

                // Log difference
                const dashboardId = (localDashboard || remoteDashboard).id;
                console.info("Dashboard update available.", dashboardId);
                console.debug("shareEqual", sharedEqual, dashboardId);
                console.debug("widgetsEqual", widgetsEqual, dashboardId);
                console.debug("timeStamp", localDashboard?.timeStamp, '<', remoteDashboard.timeStamp, dashboardId);
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
        DashboardsRepository.isUpdateAvailable = false;
        DashboardsRepository._mapAndApplyDashboards(newDashboards);
        DashboardsRepository.isLoading = false;

        // Persist dashboards locally
        if (typeof localStorage !== 'undefined') {
            LocalStorageService.setItem('signalco-cache-dashboards', DashboardsRepository._dashboardsCache);
        }
    }

    private static _mapDashboardModelToCache(d: IDashboardModel, di: number, existingMaxOrder: number | undefined) {
        const favorites = LocalStorageService.getItemOrDefault<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const dashboardsOrder = LocalStorageService.getItemOrDefault<string[]>(DashboardsOrderLocalStorageKey, [])

        d.order = dashboardsOrder.indexOf(d.id);
        if (d.order < 0) {
            d.order = Math.max(existingMaxOrder || di, di) + 1;
        }

        d.timeStamp = d.timeStamp ? (typeof d.timeStamp === 'string' ? new Date(d.timeStamp) : d.timeStamp) : undefined;
        d.isFavorite = favorites.indexOf(d.id) >= 0;
        d.widgets = (typeof d.configurationSerialized !== 'undefined' && d.configurationSerialized != null
                ? ((JSON.parse(d.configurationSerialized).widgets ?? []) as Array<IWidget>).map(i => {
                    return new WidgetModel(i.id, i.order, i.type, i.config);
                })
                : [])
            .map((w, i) => {
                w.id = i.toString();
                return w;
            });

        // Apply widget order
        let maxOrder = 0;
        for (let i = 0; i < d.widgets.length; i++) {
            const w = d.widgets[i];
            maxOrder = Math.max(maxOrder, w.order);
            if (typeof w.order === 'undefined'){
                console.debug('Widget has no order, applying default...');
                w.order = i;
            }
        }

        return isObservable(d) ? d : makeAutoObservable(d);
    }

    private static async _mapAndApplyDashboards(updatedDashboards: IDashboardModel[]) {
        runInAction(() => {
            const maxOrder = arrayMax(updatedDashboards, d => d.order);

            const mappedUpdatedDashboards = updatedDashboards.map((d, di) => DashboardsRepository._mapDashboardModelToCache(d, di, maxOrder));

            // Add new dashboards
            mappedUpdatedDashboards.filter(d => !DashboardsRepository._dashboardsCache.find(ed => ed.id === d.id)).forEach(d =>
                DashboardsRepository._dashboardsCache.push(d));

            // Remove non existing dashboards
            DashboardsRepository._dashboardsCache.filter(cd => !mappedUpdatedDashboards.find(ud => ud.id === cd.id)).forEach(cd =>
                DashboardsRepository._dashboardsCache.remove(cd));

            // Remap existing values
            mappedUpdatedDashboards.forEach((ud: any) => {
                const cachedDashboard: any = DashboardsRepository._dashboardsCache.find(cd => cd.id === ud.id);
                if (!cachedDashboard) return;

                Object.keys(ud).forEach(udk => cachedDashboard[udk] = ud[udk]);
            })

            //DashboardsRepository._dashboardsCache.replace(updatedDashboards.map((d, di) => DashboardsRepository._mapDashboardModelToCache(d, di, maxOrder)));
        });
    }

    private static async _setRemoteDashboardAsync(dashboard: IDashboardSetModel): Promise<string> {
        const response = await HttpService.requestAsync("/dashboards/set", "post", SignalDashboardSetDto.ToDto(dashboard));
        return response.id;
    }

    private static async _getRemoteDahboardsAsync() {
        return (await HttpService.getAsync<SignalDashboardDto[]>("/dashboards")).map(SignalDashboardDto.FromDto);
    }
}
