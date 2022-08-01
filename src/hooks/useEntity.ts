import { useCallback } from 'react';
import EntityRepository from 'src/entity/EntityRepository';
import useLoadAndError from './useLoadAndError';

function useEntity(id?: string) {
    const loadEntityFunc = useCallback(() => id ? EntityRepository.byIdAsync(id) : undefined, [id]);
    return useLoadAndError(loadEntityFunc);
}

export default useEntity;
