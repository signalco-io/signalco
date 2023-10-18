import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IDashboardSetModel, saveDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useSaveDashboard() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (dashboard: IDashboardSetModel) => {
            return saveDashboardAsync(dashboard);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['dashboards'] });
        }
    });
}
