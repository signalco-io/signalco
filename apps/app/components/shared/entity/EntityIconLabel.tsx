import React from 'react';
import {
    Loadable, Row, Stack,
    Typography
} from '@signalco/ui';
import useEntity from '../../../src/hooks/signalco/useEntity';
import EntityIcon from './EntityIcon';

type EntityIconLabelProps = {
    entityId: string | undefined;
    description?: string;
};

export default function EntityIconLabel({ entityId, description }: EntityIconLabelProps) {
    const { data: entity, isLoading: loadingEntity, error } = useEntity(entityId);
    const isLoading = !!entityId && loadingEntity;

    const entityName = entity?.alias ?? (entity?.id);
    const Icon = EntityIcon(entity);

    return (
        <Row spacing={2} style={{ minWidth: 0 }}>
            {entity && <Icon />}
            <Stack alignItems="start" style={{ minWidth: 0 }}>
                <Typography noWrap maxWidth="100%">
                    <Loadable isLoading={isLoading} loadingLabel="Loading entity" error={error}>
                        {entityName}
                    </Loadable>
                </Typography>
                {!isLoading && (
                    <Typography level="body2">
                        {description}
                    </Typography>
                )}
            </Stack>
        </Row>
    );
}
