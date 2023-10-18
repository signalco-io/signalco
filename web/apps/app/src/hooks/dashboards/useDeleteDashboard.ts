import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useDeleteDashboard() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => {
            return deleteDashboardAsync(id);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['dashboards'] });
        }
    });
}
