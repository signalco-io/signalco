'use client';

import { PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { AI, Store } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { QueryList } from '@signalco/ui/QueryList';
import { initials } from '@signalco/js';
import { KnownPages } from '../../../../../src/knownPages';
import { useWorkers } from '../../../../../src/hooks/data/workers/useWorkers';
import { AppSidebar } from '../../../../../src/components/AppSidebar';

export type PartyWorker = {
    id: string;
    name: string;
};

type WorkersListItemProps = {
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

function WorkersListEmptyPlaceholder() {
    return (
        <Typography className="p-3" tertiary level="body2">
            No workers
        </Typography>
    );
}

function WorkersList({ selectedWorkerId }: { selectedWorkerId?: string }) {
    const workers = useWorkers();

    return (
        <QueryList
            query={() => workers}
            className="gap-1 overflow-y-auto p-2"
            itemRender={(item) => (<WorkersListItem worker={item} selected={item.id === selectedWorkerId} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />}
        />
    );
}

export default function AppWorkersLayout({ children }: PropsWithChildren) {
    const router = useRouter();
    const pathname = usePathname();
    const selectedWorkerId = pathname.split('/')[3];

    return (
        <SplitView>
            <AppSidebar>
                <List className="p-2" spacing={1}>
                    <ListItem
                        nodeId="marketplace"
                        onSelected={() => router.push(KnownPages.AppMarketplace)}
                        label="Workers Marketplace"
                        startDecorator={<Store className="w-5" />}
                        className="justify-start gap-2 px-2" />
                    <ListItem
                        nodeId="marketplace"
                        selected
                        onSelected={() => router.push(KnownPages.AppWorkers)}
                        label="Workers"
                        startDecorator={<AI className="w-5" />}
                        className="justify-start gap-2 px-2" />
                </List>
                <ListHeader header="Workers" className="px-2" />
                <WorkersList selectedWorkerId={selectedWorkerId} />
            </AppSidebar>
            <div className="h-full">
                {children}
            </div>
        </SplitView>
    )
}
