import { useMemo } from 'react';
import useAllEntities from '../signalco/entity/useAllEntities';
import { Dashboard, dashboardModelFromEntity } from '../../dashboards/DashboardsRepository';

export default function useDashboards(): Omit<ReturnType<typeof useAllEntities>, 'data'> & { data: Dashboard[] | undefined } {
    const dashboardEntities = useAllEntities(2);
    return useMemo(() => ({
        ...dashboardEntities,
        data: dashboardEntities.data?.map((entity) => dashboardModelFromEntity(entity))
    }), [dashboardEntities]);
}
