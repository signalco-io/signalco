import { useMemo } from 'react';
import useDashboards from './useDashboards';
import { IDashboardModel } from '../../dashboards/DashboardsRepository';

export default function useDashboard(id?: string): Omit<ReturnType<typeof useDashboards>, 'data'> & { data: IDashboardModel | undefined } {
    const dashboards = useDashboards();
    return useMemo(() => ({
        ...dashboards,
        data: dashboards.data?.find(d => d.id === id)
    }), [dashboards]);
}
