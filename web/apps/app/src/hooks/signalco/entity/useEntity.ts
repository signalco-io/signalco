import { QueryClient } from '@tanstack/react-query';
import IEntityDetails from '../../../entity/IEntityDetails';
import { entityTypes } from '../../../entity/EntityHelper';
import { useEntities } from './useEntities';
import { allEntitiesKey } from './useAllEntities';

export function entityKey(id: string | undefined) {
    if (typeof id === 'undefined')
        return ['entity'];
    return ['entity', id];
}

export function findEntity(client: QueryClient, id: string | undefined) {
    return entityTypes
        .map(entityType => client.getQueryData<IEntityDetails[]>(allEntitiesKey(entityType.value))?.find(e => e.id === id))
        .filter(Boolean)
        .at(0);
}

export default function useEntity(id: string | undefined) {
    const result = useEntities([id]);
    return {
        isLoading: result?.at(0)?.isLoading ?? false,
        isPending: result?.at(0)?.isPending ?? false,
        isStale: result?.at(0)?.isStale ?? false,
        error: result?.at(0)?.error,
        data: result?.at(0)?.data,
    }
}
