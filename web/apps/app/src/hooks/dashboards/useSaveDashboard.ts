import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityKey } from '../signalco/entity/useEntities';
import { allEntitiesKey } from '../signalco/entity/useAllEntities';
import { DashboardSet, DashboardSetConfiguration, saveDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useSaveDashboard(): UseMutationResult<string, Error, DashboardSet | DashboardSetConfiguration, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (dashboard: DashboardSet | DashboardSetConfiguration) => {
            return saveDashboardAsync(dashboard);
        },
        onSuccess: (_, dashboard) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(dashboard.id) });
        }
    });
}
