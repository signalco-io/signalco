import { useQuery } from '@tanstack/react-query';
import { entitiesAsync } from '../../../entity/EntityRepository';

export function allEntitiesKey(type?: number | undefined) {
    if (typeof type === 'undefined')
        return ['entities'];
    return ['entities', type];
}

const useAllEntities = (type?: number | undefined) => useQuery({
    queryKey: allEntitiesKey(type),
    queryFn: async () => await entitiesAsync(type) ?? undefined,
    staleTime: 60 * 1000 // 1min
});

export default useAllEntities;
