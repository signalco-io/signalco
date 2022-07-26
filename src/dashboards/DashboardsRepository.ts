import { action, isObservable, makeAutoObservable, makeObservable, observable, onBecomeObserved, runInAction } from 'mobx';
import ContactRepository from 'src/contacts/ContactRepository';
import IEntityDetails from 'src/entity/IEntityDetails';
import IUser from 'src/users/IUser';
import { widgetType } from '../../components/widgets/Widget';
import EntityRepository from '../entity/EntityRepository';
import { arrayMax, orderBy, sequenceEqual } from '../helpers/ArrayHelpers';
import LocalStorageService from '../services/LocalStorageService';
import UserSettingsProvider from '../services/UserSettingsProvider';

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
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
    order: number;
    timeStamp: Date | undefined;

    constructor(id: string, name: string, configurationSerialized: string | undefined, sharedWith: IUser[], timeStamp: Date | undefined, order: number) {
        this.id = id;
        this.name = name;
        this.configurationSerialized = configurationSerialized;
        this.isFavorite = false;
        this.widgets = [];
        this.sharedWith = sharedWith;
        this.timeStamp = timeStamp;
        this.order = order;

        makeAutoObservable(this);
    }
}

function dashboardModelFromEntity(entity: IEntityDetails, order: number) {
    const configurationSerialized = entity.contacts.find(c => c.contactName === 'configuration');
    const dashboard = new DashboardModel(
        entity.id,
        entity.alias,
        configurationSerialized?.valueSerialized,
        entity.sharedWith,
        entity.timeStamp,
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

const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';
const DashboardsOrderLocalStorageKey = 'dashboards-order';
const DashboardsCacheLocalStorageKey = 'signalco-cache-dashboards';

class DashboardsRepository {
    dashboards: IDashboardModel[] = [];
    isLoaded: boolean = false;
    isLoading: boolean = false;
    isUpdateAvailable: boolean = false;


    constructor() {
        this._cacheDashboardsAsync = this._cacheDashboardsAsync.bind(this);
        makeObservable(this, {
            isUpdateAvailable: observable,
            isLoading: observable,
            dashboards: observable,
            _mapAndApplyDashboards: action.bound
        });

        onBecomeObserved(this, 'dashboards', this._cacheDashboardsAsync);
    }


    async getAsync(id: string | undefined) {
        if (typeof id === 'undefined')
            return undefined;

        await this._cacheDashboardsAsync();
        return this.dashboards.find(d => d.id === id);
    }

    async favoriteSetAsync(id: string, newIsFavorite: boolean) {
        const currentFavorites = UserSettingsProvider.value<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const currentFavoriteIndex = currentFavorites.indexOf(id);
        const isCurrentlyFavorite = currentFavoriteIndex >= 0;

        // Set or remove
        if (!isCurrentlyFavorite && newIsFavorite) {
            UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, [...currentFavorites, id]);
        } else if (isCurrentlyFavorite && !newIsFavorite) {
            let newFavorites = [...currentFavorites];
            newFavorites.splice(currentFavoriteIndex, 1)
            UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, newFavorites);
        }

        // Mark favorite locally
        const favoritedDashboard = this.dashboards.find(d => d.id === id);
        if (favoritedDashboard) {
            runInAction(() => {
                favoritedDashboard.isFavorite = newIsFavorite;
            });
        }
    }

    async dashboardsOrderSetAsync(ordered: string[]) {
        UserSettingsProvider.set(DashboardsOrderLocalStorageKey, ordered);
    }

    async saveDashboardsAsync(dashboards: IDashboardSetModel[]) {
        for (let i = 0; i < dashboards.length; i++) {
            await this._setRemoteDashboardAsync(dashboards[i]);
        }
        await this._applyRemoteDashboardsAsync();
    }

    async saveDashboardAsync(dashboard: IDashboardSetModel) {
        const dashboardId = await this._setRemoteDashboardAsync(dashboard);
        await this._applyRemoteDashboardsAsync();
        return dashboardId;
    }

    async deleteDashboardAsync(id: string) {
        await EntityRepository.deleteAsync(id);
        await this._applyRemoteDashboardsAsync();
    }

    async isUpdateAvailableAsync() {
        await this._checkUpdatesAvailableAsync();
        return this.isUpdateAvailable;
    }

    async applyDashboardsUpdateAsync() {
        await this._applyRemoteDashboardsAsync();
    }

    private _cacheLock = false;

    private async _cacheDashboardsAsync() {
        if (this.isLoaded) {
            return;
        }

        try {
            if (!this._cacheLock) {
                this._cacheLock = true;

                console.debug('Loading dashboards...');

                // Try to load from local storage
                if (!this.isLoading &&
                    typeof localStorage !== 'undefined' &&
                    LocalStorageService.getItem(DashboardsCacheLocalStorageKey) !== null) {
                    this.isLoading = true;

                    // Load from local storage
                    try {
                        const localDashboards = LocalStorageService.getItemOrDefault<IDashboardModel[]>(DashboardsCacheLocalStorageKey, []);
                        this._mapAndApplyDashboards(localDashboards);
                        this.isLoading = false;
                        this.isLoaded = true;
                    }
                    catch (err) {
                        console.error('Failed to load dashboards from local storage', err);
                    }
                }

                // TODO: Invalidate cache after some period
                if (this.isLoading &&
                    !this.isLoaded) {
                    await this._applyRemoteDashboardsAsync();
                }
            } else {
                // Wait to load
                while (this.isLoading) {
                    await new Promise(r => setTimeout(r, 10));
                }
            }
        }
        finally {
            this._cacheLock = false;
        }
    }

    private async _checkUpdatesAvailableAsync() {
        console.debug('Checking for dashboard updates...');

        const remoteDashboards = await this._getRemoteDahboardsAsync();

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
            const localDashboard = this.dashboards.find(d => d.id == remoteDashboard.id);
            const sharedEqual = localDashboard != null && sequenceEqual(orderBy(remoteDashboard.sharedWith, userOrder), orderBy(localDashboard.sharedWith, userOrder), userEquals);
            const widgetsEqual = localDashboard != null && sequenceEqual(remoteDashboard.widgets, localDashboard.widgets, widgetEquals);
            if (localDashboard == null ||
                remoteDashboard.timeStamp == null ||
                localDashboard.timeStamp == null ||
                !sharedEqual ||
                !widgetsEqual ||
                localDashboard.timeStamp < remoteDashboard.timeStamp) {
                this.isUpdateAvailable = true;

                // Log difference
                const dashboardId = (localDashboard || remoteDashboard).id;
                console.info('Dashboard update available.', dashboardId);
                console.debug('shareEqual', sharedEqual, dashboardId);
                console.debug('widgetsEqual', widgetsEqual, dashboardId);
                console.debug('timeStamp', localDashboard?.timeStamp, '<', remoteDashboard.timeStamp, dashboardId);
            }
        });

        // Check deleted dashboards
        this.dashboards.forEach(localDashboard => {
            const remoteDashboard = remoteDashboards.find(d => d.id === localDashboard.id);
            if (remoteDashboard == null) {
                this.isUpdateAvailable = true;
                console.debug('Dashboard update available. Dashboard doesn\'t exist on remote: ', localDashboard.id, localDashboard.name);
            }
        });
    }

    private async _applyRemoteDashboardsAsync() {
        this.isLoading = true;

        // Download cache
        const newDashboards = await this._getRemoteDahboardsAsync();
        newDashboards.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        this.isUpdateAvailable = false;
        this._mapAndApplyDashboards(newDashboards);
        this.isLoading = false;

        // Persist dashboards locally
        if (typeof localStorage !== 'undefined') {
            LocalStorageService.setItem(DashboardsCacheLocalStorageKey, this.dashboards);
        }
    }

    private _mapDashboardModelToCache(d: IDashboardModel, di: number, existingMaxOrder: number | undefined) {
        const favorites = UserSettingsProvider.value<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const dashboardsOrder = UserSettingsProvider.value<string[]>(DashboardsOrderLocalStorageKey, [])

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

    async _mapAndApplyDashboards(updatedDashboards: IDashboardModel[]) {
            const maxOrder = arrayMax(updatedDashboards, d => d.order);

            const mappedUpdatedDashboards = updatedDashboards.map((d, di) => this._mapDashboardModelToCache(d, di, maxOrder));

            // Add new dashboards
            mappedUpdatedDashboards.filter(d => !this.dashboards.find(ed => ed.id === d.id)).forEach(d =>
                this.dashboards.push(d));

            // Remove non existing dashboards
            this.dashboards.filter(cd => !mappedUpdatedDashboards.find(ud => ud.id === cd.id)).forEach(cd =>
                this.dashboards.splice(this.dashboards.indexOf(cd), 1));

            // Remap existing values
            mappedUpdatedDashboards.forEach((ud: any) => {
                const cachedDashboard: any = this.dashboards.find(cd => cd.id === ud.id);
                if (!cachedDashboard) return;

                Object.keys(ud).forEach(udk => cachedDashboard[udk] = ud[udk]);
            });

            console.debug('Dashboards applied');

            //this._dashboardsCache.replace(updatedDashboards.map((d, di) => this._mapDashboardModelToCache(d, di, maxOrder)));
    }

    private async _setRemoteDashboardAsync(dashboard: IDashboardSetModel): Promise<string> {
        const id = await EntityRepository.upsertAsync(dashboard.id, 2, dashboard.name);
        await ContactRepository.setAsync({entityId: id, channelName: 'config', contactName: 'configuration'}, dashboard.configurationSerialized);
        return id;
    }

    private async _getRemoteDahboardsAsync() {
        return (await EntityRepository.byTypeAsync(2)).map(dashboardModelFromEntity);
    }
}

const instance = new DashboardsRepository();

export default instance;
