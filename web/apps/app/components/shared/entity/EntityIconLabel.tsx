import React from 'react';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import EntityIcon from './EntityIcon';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { Row } from '@signalco/ui/dist/Row';
import { Stack } from '@signalco/ui/dist/Stack';
import { Typography } from '@signalco/ui/dist/Typography';

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
                <div style={{ maxWidth: '100%' }}>
                    <Typography noWrap>
                        <Loadable isLoading={isLoading} loadingLabel="Loading entity" error={error}>
                            {entityName}
                        </Loadable>
                    </Typography>
                </div>
                {!isLoading && (
                    <Typography level="body2">
                        {description}
                    </Typography>
                )}
            </Stack>
        </Row>
    );
}
