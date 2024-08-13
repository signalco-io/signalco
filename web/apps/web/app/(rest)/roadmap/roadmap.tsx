import { PropsWithChildren } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { Card } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { Up } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { ItemsShowMore } from '@signalco/ui/FilterList';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import { RoadmapItem as RoadmapItemModel, RoadmapItemStatus } from '../../api/github/[owner]/[repo]/issues/route';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';

const statusOrderedList: RoadmapItemStatus[] = ['inProgress', 'inQueue', 'planned', 'triage', 'completed'];

function VoteButton({ votes, readonly, size = 'md' }: { votes?: number | undefined, readonly?: boolean, size?: 'sm' | 'md' }) {
    if (readonly) {
        return (
            <Card className="aspect-square w-10 rounded-sm text-center">
                <span className="leading-10">{votes ?? 'Vote'}</span>
            </Card>
        )
    }

    return (
        <Button
            size="sm"
            style={{
                paddingLeft: size === 'sm' ? 8 : undefined,
                paddingRight: size === 'sm' ? 8 : undefined
            }}>
            <Stack alignItems="center" spacing={size === 'sm' ? 0 : 1} style={{ paddingTop: size === 'sm' ? 0 : 4 }}>
                <Up />
                <span className={cx(
                    'pb-4',
                    size === 'sm' && 'pb-1'
                )}>{votes ?? 'Vote'}</span>
            </Stack>
        </Button>
    );
}

function RoadmapItem({ item }: { item: RoadmapItemModel }) {
    return (
        <div key={item.title} className="flex h-full items-center gap-2">
            <VoteButton votes={item.votes} readonly={true} size="sm" />
            {item.href ? (
                <NavigatingButton hideArrow href={item.href}>{item.title}</NavigatingButton>
            ) : (
                <Typography level="body2" noWrap>{item.title}</Typography>
            )}
        </div>
    );
}

export default function Roadmap({ items, error, isLoading }: { items: RoadmapItemModel[] | undefined, error?: string | undefined, isLoading?: boolean | undefined }) {
    return (
        <Container maxWidth="sm">
            <Stack spacing={4}>
                <PageCenterHeader level="h1" subHeader="Help us by voting our roadmap.">
                    Roadmap
                </PageCenterHeader>
                <Loadable error={error} isLoading={isLoading} loadingLabel={'Loading items'}>
                    <Stack spacing={2}>
                        {statusOrderedList.map(status => (
                            <Stack spacing={2} key={status}>
                                <Typography level="h5">{camelToSentenceCase(status)}</Typography>
                                <ItemsShowMore
                                    truncate={5}
                                    itemsWrapper={({ children }: PropsWithChildren) => <Stack spacing={1}>{children}</Stack>}
                                    loadingLabel={'Loading roadmap'}
                                    noItemsPlaceholder={'Empty at the moment'}>
                                    {orderBy(items?.filter(item => item.status === status) ?? [], (a: RoadmapItemModel, b: RoadmapItemModel) => (b.votes ?? 0) - (a.votes ?? 0)).map((item: RoadmapItemModel) => (
                                        <RoadmapItem key={item.title} item={item} />
                                    ))}
                                </ItemsShowMore>
                            </Stack>
                        ))}
                    </Stack>
                </Loadable>
            </Stack>
        </Container>
    );
}
