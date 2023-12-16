import React from 'react';
import EntityIconLabel from '../../shared/entity/EntityIconLabel';

export function EntityTitle({ entityId }: { entityId: string; }) {
    return (
        <EntityIconLabel entityId={entityId} header />
    );
}
