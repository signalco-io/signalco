import { useEntities } from './useEntities';

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
