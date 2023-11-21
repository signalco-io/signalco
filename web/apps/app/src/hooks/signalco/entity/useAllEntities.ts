import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { entitiesAsync } from '../../../entity/EntityRepository';
import IEntityDetails from '../../../entity/IEntityDetails';

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
