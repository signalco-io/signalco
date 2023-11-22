import { UseQueryResult, useQuery } from '@tanstack/react-query';
import IEntityDetails from '../../../entity/IEntityDetails';
import { entitiesAsync } from '../../../entity/EntityRepository';

export function allEntitiesKey(type?: number | undefined) {
    if (typeof type === 'undefined')
        return ['entities'];
    return ['entities', type];
}

function useAllEntities(type?: number | undefined): UseQueryResult<IEntityDetails[] | undefined, Error> {
    return useQuery({
        queryKey: allEntitiesKey(type),
        queryFn: async () => await entitiesAsync(type) ?? undefined,
        staleTime: 60 * 1000
    });
}

export default useAllEntities;
