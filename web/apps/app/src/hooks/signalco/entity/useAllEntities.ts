import { useQuery } from '@tanstack/react-query';
import { entitiesAsync } from '../../../entity/EntityRepository';

export function allEntitiesKey(type?: number | undefined){
    return ['entities', type]
}

const useAllEntities = (type?: number | undefined) => useQuery(
    allEntitiesKey(type),
    () => entitiesAsync(type),
    {
        staleTime: 60 * 1000 // 1min
    }
);

export default useAllEntities;
