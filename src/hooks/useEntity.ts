import { useQuery, useQueryClient } from '@tanstack/react-query';
import { entityAsync } from 'src/entity/EntityRepository';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function useEntity(id: string | undefined) {
    const client = useQueryClient();
    return useQuery(['entity', id], () => {
        if (!id)
            throw new Error('Entity Id is required');
        return entityAsync(id);
    }, {
        initialData: () => client.getQueryData<IEntityDetails[]>(['entities'])?.find(e => e.id === id),
        initialDataUpdatedAt: () => client.getQueryState(['entities'])?.dataUpdatedAt,
        enabled: Boolean(id),
        staleTime: 60*1000
    });
}
