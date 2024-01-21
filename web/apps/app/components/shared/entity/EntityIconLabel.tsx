import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Loadable } from '@signalco/ui/Loadable';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import EntityIcon from './EntityIcon';

type EntityIconLabelProps = {
    entityId: string | undefined;
    description?: string;
    header?: boolean;
};

export default function EntityIconLabel({ entityId, description, header }: EntityIconLabelProps) {
    const { data: entity, isLoading: loadingEntity, error } = useEntity(entityId);
    const isLoading = !!entityId && loadingEntity;

    const entityName = entity?.alias ?? (entity?.id);

    return (
        <Row spacing={2} style={{ minWidth: 0 }}>
            {entity && header ? (
                <Avatar className="p-1">
                    <EntityIcon entity={entity} />
                </Avatar>
            ) : entity && (<EntityIcon entity={entity} />)}
            <Stack alignItems="start" style={{ minWidth: 0 }}>
                <div className="max-w-full">
                    <Loadable isLoading={isLoading} loadingLabel="Loading entity" error={error}>
                        <Typography noWrap>
                            {entityName}
                        </Typography>
                    </Loadable>
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
