import { useQuery } from '@tanstack/react-query';
import { entitiesAsync } from '../../entity/EntityRepository';

const useAllEntities = (type?: number | undefined) => useQuery([type ? `entities-${type}` : 'entities'], () => entitiesAsync(type), {
    staleTime: 60*1000 // 1min
});

export default useAllEntities;
