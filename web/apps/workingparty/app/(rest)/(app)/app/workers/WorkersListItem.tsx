'use client';

import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { initials } from '@signalco/js';
import { KnownPages } from '../../../../../src/knownPages';

export type PartyWorker = {
    id: string;
    name: string;
};

export type WorkersListItemProps = {
    worker: PartyWorker;
    selected: boolean;
};

export function WorkersListItem({ worker, selected }: WorkersListItemProps) {
    const router = useRouter();
    return (
        <ListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{worker.name}</Typography>
                </Stack>
            )}
            startDecorator={<Avatar size="sm" className="bg-foreground text-background">{initials(worker.name)}</Avatar>}
            className="group w-full"
            nodeId={worker.id}
            selected={selected}
            onSelected={(id: string) => router.push(KnownPages.AppWorker(id))}
            onMouseEnter={() => router.prefetch(KnownPages.AppWorker(worker.id))} />
    );
}
