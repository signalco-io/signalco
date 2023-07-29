import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import IEntityDetails from '../../../entity/IEntityDetails';
import { entityAsync } from '../../../entity/EntityRepository';
import { entityTypes } from '../../../entity/EntityHelper';
import { allEntitiesKey } from './useAllEntities';

function findEntity(client: QueryClient, id: string | undefined) {
    return entityTypes
        .map(entityType => client.getQueryData<IEntityDetails[]>(allEntitiesKey(entityType.value))?.find(e => e.id === id))
        .filter(Boolean)
        .at(0);
}

export default function useEntity(id: string | undefined) {
    const client = useQueryClient();
    return useQuery(['entity', id], () => {
        if (!id)
            throw new Error('Entity Id is required');
        return entityAsync(id);
    }, {
        initialData: () => findEntity(client, id),
        initialDataUpdatedAt: () => client.getQueryState(['entities'])?.dataUpdatedAt,
        enabled: Boolean(id),
        staleTime: 60*1000
    });
}
