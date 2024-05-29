import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityKey } from '../signalco/entity/useEntities';
import { allEntitiesKey } from '../signalco/entity/useAllEntities';
import { IDashboardSetModel, saveDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useSaveDashboard(): UseMutationResult<string, Error, IDashboardSetModel, unknown> {
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
