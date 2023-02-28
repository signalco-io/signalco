'use client';

import { Octokit } from 'octokit';
import { Up } from '@signalco/ui-icons';
import Stack from '@signalco/ui/dist/Stack';
import Row from '@signalco/ui/dist/Row';
import { Button, ChildrenProps, Chip, Container, ItemsShowMore, Loadable, Typography } from '@signalco/ui';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
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
        <div key={item.title}>
            <Row spacing={2} alignItems="start" style={{ height: '100%' }}>
                <Button size="sm">
                    <Stack alignItems="center" spacing={1} style={{ paddingTop: 4 }}>
                        <Up />
                        <span style={{ paddingBottom: 16 }}>{item.votes ?? 'Vote'}</span>
                    </Stack>
                </Button>
                <Stack spacing={1} justifyContent="space-between" style={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
                    <Typography level="body2">{item.title}</Typography>
                    <Row>
                        <Chip>{camelToSentenceCase(item.scope)}</Chip>
                    </Row>
                </Stack>
            </Row>
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
