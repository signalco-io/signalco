import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityKey } from '../signalco/entity/useEntity';
import { allEntitiesKey } from '../signalco/entity/useAllEntities';
import { IDashboardSetModel, saveDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useSaveDashboard() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (dashboard: IDashboardSetModel) => {
            return saveDashboardAsync(dashboard);
        },
        onSuccess: (_, dashboard) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(dashboard.id) });
        }
    });
}
