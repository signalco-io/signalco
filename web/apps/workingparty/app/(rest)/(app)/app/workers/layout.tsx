'use client';

import { PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { AI, Store } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { KnownPages } from '../../../../../src/knownPages';
import { AppSidebar } from '../../../../../src/components/AppSidebar';
import { WorkersList } from './WorkersList';

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
