import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useDeleteDashboard() {
    const client = useQueryClient();
    return useMutation((id: string) => {
        return deleteDashboardAsync(id);
    }, {
        onSuccess: (id) => {
            client.invalidateQueries(['dashboards']);
            client.invalidateQueries(['dashboard', id]);
        }
    });
}
