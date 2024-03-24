import { arrayMax, objectWithKey } from '@signalco/js';
import IUser from '../users/IUser';
import UserSettingsProvider from '../services/UserSettingsProvider';
import IEntityDetails from '../entity/IEntityDetails';
import { entityUpsertAsync, entityDeleteAsync } from '../entity/EntityRepository';
import { setAsync } from '../contacts/ContactRepository';
import { widgetType } from '../../components/widgets/Widget';

export interface IDashboardSetModel {
    configurationSerialized?: string;
    name: string;
    id?: string;
}

export interface IWidget {
    id: string,
    order: number,
    type: widgetType,
    config?: Record<string, unknown>
}

export class WidgetModel implements IWidget {
    id: string;
    order: number;
    type: widgetType;
    config?: Record<string, unknown> | undefined;

    constructor(id: string, order: number, type: widgetType, config?: Record<string, unknown> | undefined) {
        this.id = id;
        this.order = order;
        this.type = type;
        this.config = config;
    }
}

export interface IDashboardModel {
    name: string;
    id: string;
    timeStamp?: Date;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
    order: number;
    background?: string | undefined;

    get configurationSerialized() : string;
}

class DashboardModel implements IDashboardModel {
    name: string;
    id: string;
    isFavorite: boolean;
    widgets: IWidget[];
    sharedWith: IUser[];
    order: number;
    timeStamp: Date | undefined;
    background?: string | undefined;

    constructor(
        id: string,
        name: string,
        sharedWith: IUser[],
        isFavorite: boolean | undefined,
        timeStamp: Date | undefined,
        order: number,
        background: string | undefined) {
        this.id = id;
        this.name = name;
        this.isFavorite = isFavorite ?? false;
        this.widgets = [];
        this.sharedWith = sharedWith;
        this.timeStamp = timeStamp;
        this.order = order;
        this.background = background;
    }

    public get configurationSerialized() : string {
        return JSON.stringify({
            widgets: this.widgets,
            background: this.background
        });
    }
}

export function dashboardModelFromEntity(entity: IEntityDetails, order: number, favorites: string[]): IDashboardModel {
    const configurationSerializedContact = entity.contacts.find(c => c.channelName === 'config' && c.contactName === 'configuration');
    const configurationSerialized = configurationSerializedContact?.valueSerialized;

    const dashboardBackground = configurationSerialized != null
        ? (objectWithKey(JSON.parse(configurationSerialized), 'background')?.background ?? undefined) as (string | undefined)
        : undefined;

    const dashboard = new DashboardModel(
        entity.id,
        entity.alias,
        entity.sharedWith,
        favorites.indexOf(entity.id) >= 0,
        entity.timeStamp,
        order,
        dashboardBackground);

    dashboard.widgets = (configurationSerialized != null
        ? (objectWithKey(JSON.parse(configurationSerialized), 'widgets')?.widgets ?? []) as Array<IWidget> // TODO: Construct models
        : [])
        .map((w, i) => ({ ...w, id: i.toString() }));

    // Apply widget order (if not specified)
    for (const w of dashboard.widgets) {
        if (typeof w.order === 'undefined'){
            const maxOrder = arrayMax(dashboard.widgets.filter(w => typeof w.order !== 'undefined').map(i => i.order), (i => i));
            w.order = (maxOrder ?? 0) + 1;
        }
    }

    return dashboard;
}

export async function saveDashboardAsync(dashboard: IDashboardSetModel) {
    const id = await entityUpsertAsync(dashboard.id, 2, dashboard.name);
    await setAsync({
        entityId: id,
        channelName: 'config',
        contactName: 'configuration'
    },
    dashboard.configurationSerialized);
    return id;
}

export function deleteDashboardAsync(id: string) {
    return entityDeleteAsync(id);
}

export const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';
const DashboardsOrderLocalStorageKey = 'dashboards-order';

class DashboardsRepository {
    isLoaded = false;
    isLoading = false;
    isUpdateAvailable = false;

    async favoriteSetAsync(id: string, newIsFavorite: boolean) {
        const currentFavorites = UserSettingsProvider.value<string[]>(DashboardsFavoritesLocalStorageKey, []);
        const currentFavoriteIndex = currentFavorites.indexOf(id);
        const isCurrentlyFavorite = currentFavoriteIndex >= 0;

        // Set or remove
        if (!isCurrentlyFavorite && newIsFavorite) {
            UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, [...currentFavorites, id]);
        } else if (isCurrentlyFavorite && !newIsFavorite) {
            const newFavorites = [...currentFavorites];
            newFavorites.splice(currentFavoriteIndex, 1)
            UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, newFavorites);
        }

        // Mark favorite locally
        // const favoritedDashboard = this.dashboards.find(d => d.id === id);
        // if (favoritedDashboard) {
        //     favoritedDashboard.isFavorite = newIsFavorite;
        // }
        // TODO: Refresh
    }

    async dashboardsOrderSetAsync(ordered: string[]) {
        UserSettingsProvider.set(DashboardsOrderLocalStorageKey, ordered);
    }
}

const instance = new DashboardsRepository();

export default instance;
