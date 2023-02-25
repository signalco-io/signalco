'use client';

import Stack from '@signalco/ui/dist/Stack';
import Row from '@signalco/ui/dist/Row';
import { camelToSentenceCase, orderBy } from '@signalco/js';
import { Button, Card, Typography } from '@signalco/ui';
import { Up } from '@signalco/ui-icons';

type RoadmapItem = {
    title: string;
    status: 'triage' | 'planned' | 'in-queue' | 'in-progress' | 'completed';
    scope: 'app' | 'channels';
    votes?: number | undefined;
}

const items: RoadmapItem[] = [
    {
        title: 'Improve Accessibility',
        status: 'planned',
        scope: 'app'
    },
    {
        title: 'Nordigen',
        status: 'triage',
        scope: 'channels'
    },
    {
        title: 'Mi Home',
        status: 'planned',
        scope: 'channels'
    },
    {
        title: 'Bambu Lab',
        status: 'in-queue',
        scope: 'channels'
    },
    {
        title: 'Zigbee2MQTT',
        status: 'in-progress',
        scope: 'channels',
        votes: 13
    },
    {
        title: 'Slack',
        status: 'in-progress',
        scope: 'channels',
        votes: 2
    },
    {
        title: 'Sun (time of day)',
        status: 'in-progress',
        scope: 'channels',
        votes: 5
    }
];

function RoadmapItem({ item }: { item: RoadmapItem }) {
    return (
        <Card key={item.title} sx={{ minWidth: '220px' }}>
            <Row spacing={2} alignItems="start">
                <Button size="sm">
                    <Stack alignItems="center" spacing={1} style={{ paddingTop: 4 }}>
                        <Up />
                        <span style={{ paddingBottom: 16 }}>{item.votes ?? 'Vote'}</span>
                    </Stack>
                </Button>
                <Stack>
                    <div>{item.title}</div>
                    <Typography level="body2"></Typography>
                </Stack>
            </Row>
        </Card>
    );
}

export default function RoadmapPage() {
    const scopes = [...new Set(items.map(item => item.scope))];

    return (
        <div>
            <Stack spacing={8}>
                {scopes.map(scope => (
                    <Row key={scope} spacing={2}>
                        <div style={{

                        }}>
                            <h2>{camelToSentenceCase(scope)}</h2>
                        </div>
                        <Stack spacing={1}>
                            {[...new Set(items.filter(item => item.scope === scope).map(item => item.status))].map(status => (
                                <>
                                    <div>{status}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {orderBy(items.filter(item => item.scope === scope && item.status === status), (a, b) => (b.votes ?? 0) - (a.votes ?? 0)).map(item => (
                                            <RoadmapItem key={item.title} item={item} />
                                        ))}
                                    </div>
                                </>
                            ))}
                        </Stack>
                    </Row>
                ))}
            </Stack>
        </div>
    );
}
