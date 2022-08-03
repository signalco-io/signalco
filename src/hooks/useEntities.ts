import { useEffect, useState } from 'react';
import EntityRepository from 'src/entity/EntityRepository';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function useEntities(deviceIds?: string[]) {
    const [entities, setEntities] = useState<(IEntityDetails | undefined)[] | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (deviceIds) {
                const newDevices = [];
                for (let i = 0; i < deviceIds.length; i++) {
                    const deviceId = deviceIds[i];
                    const device = await EntityRepository.byIdAsync(deviceId);
                    newDevices.push(device);
                }
                setEntities(newDevices);
            }
        })();
    }, [deviceIds]);
    return entities;
}
