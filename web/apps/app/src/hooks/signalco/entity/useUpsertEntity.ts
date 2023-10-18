import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityUpsertAsync } from '../../../entity/EntityRepository';
import { entityKey } from './useEntity';
import { allEntitiesKey } from './useAllEntities';

type EntityUpsertArgs = { id: string | undefined, type: number, alias: string };

export default function useUpsertEntity() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ id, type, alias }: EntityUpsertArgs) => entityUpsertAsync(id, type, alias),
        onSuccess: (_, { id }: EntityUpsertArgs) => {
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(id) });
        }
    });
}
