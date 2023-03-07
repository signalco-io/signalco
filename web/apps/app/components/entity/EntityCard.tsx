import Link from 'next/link';
import { Row, Avatar, Card, Typography, Box, Timeago, MuiStack, Checkbox } from '@signalco/ui';
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
    selectable?: boolean;
    selected?: boolean;
    onSelection?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EntityCard({ entity, spread, selectable, selected, onSelection }: EntityCardProps) {
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);
    const Icon = EntityIcon(entity);

    return (
        <Row spacing={1}>
            {selectable && <Checkbox checked={selected ?? false} onChange={onSelection} sx={{ ml: 1 }} />}
            <Link href={`${KnownPages.Entities}/${entity.id}`} style={{ flexGrow: 1 }}>
                <Card sx={{ height: '100%', p: spread ? 0 : 1 }}>
                    <MuiStack
                        spacing={2}
                        direction={spread ? 'row' : 'column'}
                        justifyContent="space-between"
                        sx={{ height: '100%' }}>
                        <Row spacing={1}>
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
                                {hasBattery && <BatteryIndicator level={level} minLevel="low" />}
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
        </Row>
    );
}
