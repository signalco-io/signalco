import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityKey } from '../signalco/entity/useEntities';
import { allEntitiesKey } from '../signalco/entity/useAllEntities';
import { deleteDashboardAsync } from '../../dashboards/DashboardsRepository';

export default function useDeleteDashboard(): UseMutationResult<void, Error, string, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => {
            return deleteDashboardAsync(id);
        },
        onSuccess: (_, id) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(id) });
        }
    });
}
