import Link from 'next/link';
import { Row , Avatar, Card, Typography , Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import ShareEntityChip from './ShareEntityChip';
import EntityStatus, { useEntityStatus } from './EntityStatus';
import Timeago from '../shared/time/Timeago';
import EntityIcon from '../shared/entity/EntityIcon';
import { KnownPages } from '../../src/knownPages';
import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityLastActivity } from '../../src/entity/EntityHelper';

export interface EntityCardProps {
    entity: IEntityDetails;
    spread: boolean;
}

export default function EntityCard({ entity, spread }: EntityCardProps) {
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const Icon = EntityIcon(entity);

    return (
        <Link href={`${KnownPages.Entities}/${entity.id}`} legacyBehavior>
            <Card sx={{ height: '100%', p: spread ? 0 : 1 }}>
                <Stack
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
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ pr: spread ? 2 : 0 }}>
                            {(hasStatus && (isStale || isOffline)) && (
                                <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                    <Timeago date={entityLastActivity(entity)} />
                                </Box>
                            )}
                            <EntityStatus entity={entity} />
                        </Stack>
                    </Row>
                </Stack>
            </Card>
        </Link>
    );
}
