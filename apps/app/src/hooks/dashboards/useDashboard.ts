import { useQuery } from '@tanstack/react-query';
import useDashboards from './useDashboards';

export default function useDashboard(id?: string) {
    const dashboards = useDashboards();
    return useQuery(['dashboard', id], () => {
        const dashboard = dashboards.data?.find(d => d.id === id);
        if (!dashboard)
            throw new Error('Dashboard not found');
        return dashboard;
    }, {
        enabled: Boolean(id) && !!dashboards.data && !dashboards.isStale
    })
}
