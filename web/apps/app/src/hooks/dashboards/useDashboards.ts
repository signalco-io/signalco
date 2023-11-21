import { useMemo } from 'react';
import { useUserSettingAsync } from '../useUserSetting';
import useAllEntities from '../signalco/entity/useAllEntities';
import { DashboardsFavoritesLocalStorageKey, IDashboardModel, dashboardModelFromEntity } from '../../dashboards/DashboardsRepository';

export default function useDashboards(): Omit<ReturnType<typeof useAllEntities>, 'data'> & { data: IDashboardModel[] | undefined } {
    const dashboardEntities = useAllEntities(2);
    const [currentFavorites] = useUserSettingAsync<string[]>(DashboardsFavoritesLocalStorageKey, []);
    return useMemo(() => ({
        ...dashboardEntities,
        data: dashboardEntities.data?.map((entity, i) => dashboardModelFromEntity(entity, i, currentFavorites ?? []))
    }), [dashboardEntities, currentFavorites]);
}
