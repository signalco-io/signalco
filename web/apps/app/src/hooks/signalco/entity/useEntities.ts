import { useQueries, useQueryClient } from '@tanstack/react-query';
import { entityAsync } from '../../../entity/EntityRepository';
import { entityKey, findEntity } from './useEntity';


export function useEntities(ids: (string | undefined)[] | undefined) {
    const client = useQueryClient();
    return useQueries({
        queries: (ids ?? []).filter(Boolean).map(id => {
            return {
                queryKey: entityKey(id),
                queryFn: async () => {
                    if (!id)
                        throw new Error('Entity Id is required');
                    return await entityAsync(id) ?? null;
                },
                initialData: () => findEntity(client, id),
                initialDataUpdatedAt: () => client.getQueryState(['entities'])?.dataUpdatedAt,
                enabled: Boolean(id),
                staleTime: 60 * 1000
            };
        })
    });
}
