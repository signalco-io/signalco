import { useUserSettingAsync } from '../useUserSetting';
import useAllEntities from '../signalco/entity/useAllEntities';
import { DashboardsFavoritesLocalStorageKey, dashboardModelFromEntity } from '../../dashboards/DashboardsRepository';

export default function useDashboards() {
    const dashboardEntities = useAllEntities(2);
    const [currentFavorites] = useUserSettingAsync<string[]>(DashboardsFavoritesLocalStorageKey, []);
    return {
        ...dashboardEntities,
        data: dashboardEntities.data?.map((entity, i) => dashboardModelFromEntity(entity, i, currentFavorites ?? []))
    }
}
