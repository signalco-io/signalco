'use client';

import { Octokit } from 'octokit';
import { Up } from '@signalco/ui-icons';
import Stack from '@signalco/ui/dist/Stack';
import { Button, ChildrenProps, Chip, Container, ItemsShowMore, Loadable, NavigatingButton, Sheet, Typography } from '@signalco/ui';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import { useLoadAndError } from '@signalco/hooks';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';

type RoadmapItemStatus = 'triage' | 'planned' | 'inQueue' | 'inProgress' | 'completed';

type RoadmapItem = {
    title: string;
    status: RoadmapItemStatus;
    scope: string;
    votes?: number | undefined;
    href?: string | undefined;
}

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

async function getRoadmapItemsAsync() {
    const octokit = new Octokit();

    const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
        owner: 'signalco-io',
        repo: 'signalco',
        per_page: 50,
    });

    const items: RoadmapItem[] = [];
    for await (const { data: issues } of iterator) {
        for (const issue of issues) {
            const labelNames = issue.labels.map(l => typeof l === 'string' ? l : l.name);

            // Ignore issues that are not features or enhancements
            if (!labelNames.includes('feature') &&
                !labelNames.includes('enhancement')) {
                continue;
            }

            const title = issue.title;
            const scope = labelNames.find(label => label?.startsWith('area:'))?.replace('area:', '');
            const isApproved = !labelNames.includes('needs-triage');
            const inQueue = !!issue.milestone;
            const inProgress = !!issue.assignee;
            const isComplete = issue.state === 'closed';
            const votes = issue.reactions?.['+1'] ?? 0;
            let status: RoadmapItemStatus = 'triage';
            if (isApproved) {
                status = 'planned';
            }
            if (inQueue) {
                status = 'inQueue';
            }
            if (inProgress) {
                status = 'inProgress';
            }
            if (isComplete) {
                status = 'completed';
            }

            if (title && scope) {
                items.push({
                    title,
                    scope,
                    status,
                    votes,
                    href: issue.html_url
                });
            }
        }
    }
    return items;
}

export default function RoadmapPage() {
    const { item: items, isLoading, error } = useLoadAndError(getRoadmapItemsAsync);

    return (
        <Container maxWidth="sm">
            <Stack spacing={4}>
                <PageCenterHeader header="Roadmap" subHeader="Help us by voting our roadmap." />
                <Loadable isLoading={isLoading} error={error} loadingLabel={'Loading roadmap'}>
                    <Stack spacing={2}>
                        {statusOrderedList.map(status => (
                            <Stack spacing={2} key={status}>
                                <Typography level="h5">{camelToSentenceCase(status)}</Typography>
                                <ItemsShowMore
                                    truncate={5}
                                    itemsWrapper={({ children }: ChildrenProps) => <Stack spacing={1}>{children}</Stack>}
                                    isLoading={false}
                                    error={undefined}
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
