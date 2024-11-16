import { QueryClient, useQueries, useQueryClient } from '@tanstack/react-query';
import IEntityDetails from '../../../entity/IEntityDetails';
import { entityAsync } from '../../../entity/EntityRepository';
import { entityTypes } from '../../../entity/EntityHelper';
import { allEntitiesKey } from './useAllEntities';

export function entityKey(id: string | undefined) {
    if (typeof id === 'undefined')
        return ['entity'];
    return ['entity', id];
}

export function findEntity(client: QueryClient, id: string | undefined) {
    return entityTypes
        .map(entityType => client.getQueryData<IEntityDetails[]>(allEntitiesKey(entityType.value))?.find(e => e.id === id))
        .filter(Boolean)
        .at(0);
}

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
