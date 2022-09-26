import { useEffect, useState } from 'react';
import { entityAsync } from 'src/entity/EntityRepository';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function useEntities(entityIds?: string[]) {
    const [entities, setEntities] = useState<(IEntityDetails | undefined)[] | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (entityIds) {
                const newEntities = [];
                for (let i = 0; i < entityIds.length; i++) {
                    const entityId = entityIds[i];
                    const entity = await entityAsync(entityId);
                    newEntities.push(entity);
                }
                setEntities(newEntities);
            }
        })();
    }, [entityIds]);
    return entities;
}
