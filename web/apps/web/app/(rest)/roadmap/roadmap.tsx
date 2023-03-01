'use client';

import { Up } from '@signalco/ui-icons';
import Stack from '@signalco/ui/dist/Stack';
import { Button, ChildrenProps, Container, ItemsShowMore, Loadable, NavigatingButton, Sheet, Typography } from '@signalco/ui';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import { RoadmapItemStatus, RoadmapItem } from './page';

const statusOrderedList: RoadmapItemStatus[] = ['inProgress', 'inQueue', 'planned', 'triage', 'completed'];

function VoteButton({ votes, readonly, size = 'md' }: { votes?: number | undefined, readonly?: boolean, size?: 'sm' | 'md' }) {
    if (readonly) {
        return (
            <Sheet variant="soft" style={{ width: 42, aspectRatio: 1, textAlign: 'center', borderRadius: 'var(--joy-radius-sm)' }}>
                <span style={{ lineHeight: '42px' }}>{votes ?? 'Vote'}</span>
            </Sheet>
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
                <Typography level="body2" noWrap textOverflow="ellipsis">{item.title}</Typography>
            )}
        </div>
    );
}

export default function Roadmap({ items, error }: { items: RoadmapItem[] | undefined, error?: string | undefined }) {
    return (
        <Container maxWidth="sm">
            <Stack spacing={4}>
                <PageCenterHeader header="Roadmap" subHeader="Help us by voting our roadmap." />
                <Loadable error={error} isLoading={false} loadingLabel={'Loading items'}>
                    <Stack spacing={2}>
                        {statusOrderedList.map(status => (
                            <Stack spacing={2} key={status}>
                                <Typography level="h5">{camelToSentenceCase(status)}</Typography>
                                <ItemsShowMore
                                    truncate={5}
                                    itemsWrapper={({ children }: ChildrenProps) => <Stack spacing={1}>{children}</Stack>}
                                    loadingLabel={'Loading roadmap'}
                                    noItemsPlaceholder={'Empty at the moment'}>
                                    {orderBy(items?.filter(item => item.status === status) ?? [], (a, b) => (b.votes ?? 0) - (a.votes ?? 0)).map(item => (
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
