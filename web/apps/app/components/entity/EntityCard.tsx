import { type FormEvent } from 'react';
import Link from 'next/link';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Checkbox } from '@signalco/ui-primitives/Checkbox';
import { Card } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Timeago } from '@signalco/ui/Timeago';
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
    onSelection?: (event: FormEvent<HTMLButtonElement>) => void;
}

export default function EntityCard({ entity, spread, selectable, selected, onSelection }: EntityCardProps) {
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);

    const Container = spread ? Row : Stack;

    return (
        <Row spacing={1}>
            {selectable && <Checkbox checked={selected ?? false} onChange={onSelection} />}
            <Link href={`${KnownPages.Entities}/${entity.id}`} legacyBehavior>
                <Card className={cx('h-full p-1 grow overflow-hidden', spread && 'p-0')}>
                    <Container
                        spacing={2}
                        justifyContent="space-between"
                        className="h-full">
                        <Row spacing={1}>
                            <Avatar>
                                <EntityIcon entity={entity} />
                            </Avatar>
                            <Typography noWrap level="body1">{entity.alias}</Typography>
                        </Row>
                        <Row
                            justifyContent="space-between"
                            spacing={1}>
                            <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                            <Row spacing={1} className={cx(spread && 'pr-4')}>
                                {hasBattery && <BatteryIndicator level={level} minLevel="low" />}
                                {(hasStatus && (isStale || isOffline)) && (
                                    <div className="text-xs opacity-60">
                                        <Timeago date={entityLastActivity(entity)} />
                                    </div>
                                )}
                                <EntityStatus entity={entity} />
                            </Row>
                        </Row>
                    </Container>
                </Card>
            </Link>
        </Row>
    );
}
