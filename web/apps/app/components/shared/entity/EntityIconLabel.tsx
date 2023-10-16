import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { Avatar } from '@signalco/ui/dist/Avatar';
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
    const Icon = EntityIcon(entity);

    return (
        <Row spacing={2} style={{ minWidth: 0 }}>
            {entity && header ? (
                <Avatar className="p-1">
                    <Icon />
                </Avatar>
            ) : entity && (<Icon />)}
            <Stack alignItems="start" style={{ minWidth: 0 }}>
                <div className="max-w-full">
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
