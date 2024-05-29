import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityDeleteAsync } from '../../../entity/EntityRepository';
import { entityKey } from './useEntities';
import { allEntitiesKey } from './useAllEntities';

export default function useDeleteEntity(): UseMutationResult<void, Error, string, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: entityDeleteAsync,
        onSuccess: (_, id) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(id) });
        }
    });
}
