import { useQuery } from '@tanstack/react-query';
import { entitiesAsync } from '../../entity/EntityRepository';

const useAllEntities = () => useQuery(['entities'], () => entitiesAsync(), {
    staleTime: 60*1000 // 1min
});

export default useAllEntities;
