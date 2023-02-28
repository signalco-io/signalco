import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IDashboardSetModel, saveDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useSaveDashboard() {
    const client = useQueryClient();
    return useMutation((dashboard: IDashboardSetModel) => {
        return saveDashboardAsync(dashboard);
    }, {
        onSuccess: (id) => {
            client.invalidateQueries(['dashboards']);
            client.invalidateQueries(['dashboard', id]);
        }
    });
}
