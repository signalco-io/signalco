import Link from 'next/link';
import { Row, Avatar, Card, Typography, Box, Timeago, MuiStack } from '@signalco/ui';
import EntityIcon from '../shared/entity/EntityIcon';
import BatteryIndicator from '../indicators/BatteryIndicator';
import { KnownPages } from '../../src/knownPages';
import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityLastActivity } from '../../src/entity/EntityHelper';
import ShareEntityChip from './ShareEntityChip';
import EntityStatus, { useEntityStatus } from './EntityStatus';
import { useEntityBattery } from './EntityBattery';

export interface EntityCardProps {
    entity: IEntityDetails;
    spread: boolean;
}

export default function EntityCard({ entity, spread }: EntityCardProps) {
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);
    const Icon = EntityIcon(entity);

    return (
        <Link href={`${KnownPages.Entities}/${entity.id}`}>
            <Card sx={{ height: '100%', p: spread ? 0 : 1 }}>
                <MuiStack
                    spacing={2}
                    direction={spread ? 'row' : 'column'}
                    justifyContent="space-between"
                    sx={{ height: '100%' }}>
                    <Row spacing={2}>
                        <Avatar variant={spread ? 'plain' : 'soft'}>
                            <Icon />
                        </Avatar>
                        <Typography noWrap>{entity.alias}</Typography>
                    </Row>
                    <Row
                        justifyContent="space-between"
                        spacing={1}>
                        <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                        <Row spacing={1} style={{ paddingRight: spread ? 16 : 0 }}>
                            {hasBattery && <BatteryIndicator level={level} />}
                            {(hasStatus && (isStale || isOffline)) && (
                                <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                    <Timeago date={entityLastActivity(entity)} />
                                </Box>
                            )}
                            <EntityStatus entity={entity} />
                        </Row>
                    </Row>
                </MuiStack>
            </Card>
        </Link>
    );
}
