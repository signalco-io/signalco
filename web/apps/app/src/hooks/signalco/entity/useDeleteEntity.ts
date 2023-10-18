import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityDeleteAsync } from '../../../entity/EntityRepository';
import { entityKey } from './useEntity';
import { allEntitiesKey } from './useAllEntities';

export default function useDeleteEntity() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: entityDeleteAsync,
        onSuccess: (_, id) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(id) });
        }
    });
}
