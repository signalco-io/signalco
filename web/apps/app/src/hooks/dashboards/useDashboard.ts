import useDashboards from './useDashboards';

export default function useDashboard(id?: string) {
    const dashboards = useDashboards();
    return {
        ...dashboards,
        data: dashboards.data?.find(d => d.id === id)
    };
}
