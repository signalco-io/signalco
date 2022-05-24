import { useCallback } from 'react';
import DevicesRepository from '../devices/DevicesRepository';
import { useLoadAndError } from './useLoadingAndError';

export default function useEntity(entityId?: string) {
    const loadEntity = useCallback(async () => entityId ? await DevicesRepository.getDeviceAsync(entityId) : undefined, [entityId]);
    return useLoadAndError(loadEntity);
};
