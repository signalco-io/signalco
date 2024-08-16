import { useMemo } from 'react';
import useEntity from '../signalco/entity/useEntity';
import { dashboardModelFromEntity, IDashboardModel } from '../../dashboards/DashboardsRepository';

export default function useDashboard(id?: string): Omit<ReturnType<typeof useEntity>, 'data'> & { data: IDashboardModel | null | undefined } {
    const dashboardEntity = useEntity(id);
    const dashboard = useMemo(() =>
        dashboardEntity.data
            ? dashboardModelFromEntity(dashboardEntity.data, 0, [])
            : null,
        [dashboardEntity.data]);

    if (!dashboardEntity.isLoading && Boolean(dashboardEntity.data) && dashboardEntity.data?.type !== 2) {
        return {
            isLoading: false,
            error: new Error('Invalid dashboard entity'),
            isPending: false,
            isStale: true,
            data: null
        };
    }
    return {
        ...dashboardEntity,
        data: dashboard
    };
}
