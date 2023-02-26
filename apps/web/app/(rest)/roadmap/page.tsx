'use client';

import { Octokit } from 'octokit';
import { Up } from '@signalco/ui-icons';
import Stack from '@signalco/ui/dist/Stack';
import Row from '@signalco/ui/dist/Row';
import { Button, Card, ChildrenProps, Chip, ItemsShowMore, Loadable, LoadableProps, NoDataPlaceholder, Typography } from '@signalco/ui';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import { useLoadAndError } from '@signalco/hooks';

type RoadmapItemStatus = 'triage' | 'planned' | 'inQueue' | 'inProgress' | 'completed';

type RoadmapItem = {
    title: string;
    status: RoadmapItemStatus;
    scope: string;
    votes?: number | undefined;
}

const statusOrderedList: RoadmapItemStatus[] = ['inProgress', 'inQueue', 'planned', 'triage', 'completed'];

function RoadmapItem({ item }: { item: RoadmapItem }) {
    return (
        <Card key={item.title} sx={{ width: '280px' }}>
            <Row spacing={2} alignItems="start" style={{ height: '100%' }}>
                <Button size="sm">
                    <Stack alignItems="center" spacing={1} style={{ paddingTop: 4 }}>
                        <Up />
                        <span style={{ paddingBottom: 16 }}>{item.votes ?? 'Vote'}</span>
                    </Stack>
                </Button>
                <Stack spacing={1} justifyContent="space-between" style={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
                    <Typography level="body2">{item.title}</Typography>
                    <Row justifyContent="end">
                        <Chip>{camelToSentenceCase(item.scope)}</Chip>
                    </Row>
                </Stack>
            </Row>
        </Card>
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
                    votes
                });
            }
        }
    }
    return items;
}

export default function RoadmapPage() {
    const { item: items, isLoading, error } = useLoadAndError(getRoadmapItemsAsync);

    return (
        <Stack spacing={4}>
            {statusOrderedList.map(status => (
                <Stack spacing={1} key={status}>
                    <Typography level="h5">{camelToSentenceCase(status)}</Typography>
                    <ItemsShowMore
                        truncate={5}
                        itemsWrapper={({ children }: ChildrenProps) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>}
                        isLoading={isLoading}
                        error={error}
                        loadingLabel={'Loading roadmap'}
                        noItemsPlaceholder={'Empty at the moment'}>
                        {orderBy(items?.filter(item => item.status === status) ?? [], (a, b) => (b.votes ?? 0) - (a.votes ?? 0)).map(item => (
                            <RoadmapItem key={item.title} item={item} />
                        ))}
                    </ItemsShowMore>
                </Stack>
            ))}
        </Stack>
    );
}
