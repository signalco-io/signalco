import { arrayMax, objectWithKey } from '@signalco/js';
import UserSettingsProvider from '../services/UserSettingsProvider';
import IEntityDetails from '../entity/IEntityDetails';
import { entityUpsertAsync, entityDeleteAsync } from '../entity/EntityRepository';
import { setAsync } from '../contacts/ContactRepository';
import { widgetType } from '../../components/widgets/Widget';

export type DashboardSet = {
    id?: string;
    alias: string;
}

export type DashboardSetConfiguration = DashboardSet & {
    configuration: DashboardConfiguration;
}

export type Widget = {
    id: string,
    order: number,
    type: widgetType,
    config?: Record<string, unknown>
}

export type DashboardConfiguration = {
    widgets: Widget[];
    background?: string | undefined;
}

export type Dashboard = IEntityDetails & {
    configuration: DashboardConfiguration;
};

export function dashboardModelFromEntity(entity: IEntityDetails): Dashboard {
    const configurationSerializedContact = entity.contacts.find(c => c.channelName === 'config' && c.contactName === 'configuration');
    const configurationSerialized = configurationSerializedContact?.valueSerialized;

    const background = configurationSerialized != null
        ? (objectWithKey(JSON.parse(configurationSerialized), 'background')?.background ?? undefined) as (string | undefined)
        : undefined;

    const widgets = (configurationSerialized != null
        ? (objectWithKey(JSON.parse(configurationSerialized), 'widgets')?.widgets ?? []) as Array<Widget> // TODO: Construct models
        : [])
        .map((w, i) => ({ ...w, id: i.toString() }));

    // Apply widget order (if not specified)
    for (const w of widgets) {
        if (typeof w.order === 'undefined') {
            const maxOrder = arrayMax(widgets.filter(w => typeof w.order !== 'undefined').map(i => i.order), (i => i));
            w.order = (maxOrder ?? 0) + 1;
        }
    }

    return {
        ...entity,
        configuration: {
            widgets,
            background
        }
    };
}

export async function saveDashboardAsync(dashboard: DashboardSet | DashboardSetConfiguration) {
    const id = await entityUpsertAsync(dashboard.id, 2, dashboard.alias);
    if ('widgets' in dashboard && 'background' in dashboard) {
        const dashboardConfigurationPointer = {
            entityId: id,
            channelName: 'config',
            contactName: 'configuration'
        };
        await setAsync(dashboardConfigurationPointer,
            JSON.stringify({
                widgets: dashboard.widgets,
                background: dashboard.background
            }));
    }
    return id;
}

export function deleteDashboardAsync(id: string) {
    return entityDeleteAsync(id);
}

const DashboardsFavoritesLocalStorageKey = 'dashboards-favorites';
const DashboardsOrderLocalStorageKey = 'dashboards-order';

export function dashboardsSetFavorite(id: string, isFavorite: boolean) {
    const currentFavorites = UserSettingsProvider.value<string[]>(DashboardsFavoritesLocalStorageKey, []);
    const currentFavoriteIndex = currentFavorites.indexOf(id);
    const isCurrentlyFavorite = currentFavoriteIndex >= 0;

    // Set or remove
    if (!isCurrentlyFavorite && isFavorite) {
        UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, [...currentFavorites, id]);
    } else if (isCurrentlyFavorite && !isFavorite) {
        const newFavorites = [...currentFavorites];
        newFavorites.splice(currentFavoriteIndex, 1)
        UserSettingsProvider.set(DashboardsFavoritesLocalStorageKey, newFavorites);
    }
}

export function dashboardsGetFavorites() {
    return UserSettingsProvider.value<string[]>(DashboardsFavoritesLocalStorageKey, []);
}

export function dashboardsSetOrder(ordered: string[]) {
    UserSettingsProvider.set(DashboardsOrderLocalStorageKey, ordered);
}

export function dashboardsGetOrder() {
    return UserSettingsProvider.value<string[]>(DashboardsOrderLocalStorageKey, []);
}
