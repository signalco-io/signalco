import { PropsWithChildren } from 'react';
import { Up } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import {Stack} from '@signalco/ui/dist/Stack';
import { NavigatingButton } from '@signalco/ui/dist/NavigatingButton';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { ItemsShowMore } from '@signalco/ui/dist/FilterList';
import { Container } from '@signalco/ui/dist/Container';
import { Card } from '@signalco/ui/dist/Card';
import { Button } from '@signalco/ui/dist/Button';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import { RoadmapItem, RoadmapItemStatus } from '../../api/github/[owner]/[repo]/issues/route';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';

const statusOrderedList: RoadmapItemStatus[] = ['inProgress', 'inQueue', 'planned', 'triage', 'completed'];

function VoteButton({ votes, readonly, size = 'md' }: { votes?: number | undefined, readonly?: boolean, size?: 'sm' | 'md' }) {
    if (readonly) {
        return (
            <Card variant="soft" style={{ width: 42, aspectRatio: 1, textAlign: 'center', borderRadius: 'var(--joy-radius-sm)' }}>
                <span style={{ lineHeight: '42px' }}>{votes ?? 'Vote'}</span>
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
                <span style={{ paddingBottom: size === 'sm' ? 4 : 16 }}>{votes ?? 'Vote'}</span>
            </Stack>
        </Button>
    );
}

function RoadmapItem({ item }: { item: RoadmapItem }) {
    return (
        <div key={item.title} style={{ height: '100%', display: 'flex', gap: 8, alignItems: 'center' }}>
            <VoteButton votes={item.votes} readonly={true} size="sm" />
            {item.href ? (
                <NavigatingButton hideArrow href={item.href}>{item.title}</NavigatingButton>
            ) : (
                <Typography level="body2" noWrap>{item.title}</Typography>
            )}
        </div>
    );
}

export default function Roadmap({ items, error, isLoading }: { items: RoadmapItem[] | undefined, error?: string | undefined, isLoading?: boolean | undefined }) {
    return (
        <Container maxWidth="sm">
            <Stack spacing={4}>
                <PageCenterHeader header="Roadmap" subHeader="Help us by voting our roadmap." />
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
                                    {orderBy(items?.filter(item => item.status === status) ?? [], (a: RoadmapItem, b: RoadmapItem) => (b.votes ?? 0) - (a.votes ?? 0)).map((item: RoadmapItem) => (
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
