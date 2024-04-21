'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@signalco/ui-primitives/Stack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { ListHeader } from '@signalco/ui-primitives/List';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Settings } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { useSetSearchParam } from '@signalco/hooks/useSearchParam';
import { WorkerThreadsList } from './WorkerThreadsList';
import { WorkerDeleteModal } from './WorkerDeleteModal';

function useWorker(workerId: string) {
    return useQuery({
        queryKey: ['workers', workerId],
        queryFn: async () => {
            const response = await fetch(`/api/workers/${workerId}`);
            return await response.json() as { id: string, name: string };
        }
    });
}

export default function WorkerLayout({ children, params }: PropsWithChildren & { params: { workerid: string } }) {
    const { workerid } = params;
    const { data: worker, isLoading } = useWorker(workerid);
    const pathname = usePathname();
    const selectedThreadId = pathname.split('/')[5];
    const setIsDelete = useSetSearchParam('deleteWorker');

    return (
        <>
            <SplitView>
                <Stack className="h-screen overflow-hidden">
                    <div className="flex h-[58px] items-center border-b p-2">
                        <ListHeader
                            isLoading={isLoading}
                            header={worker?.name}
                            actions={([
                                <DropdownMenu key="menu">
                                    <DropdownMenuTrigger asChild>
                                        <IconButton variant="plain">
                                            <Settings color="gray" />
                                        </IconButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => setIsDelete('true')}
                                            className="flex items-center">
                                            Delete worker...
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ])} />
                    </div>
                    <div className="h-full overflow-y-auto p-2">
                        <WorkerThreadsList workerId={workerid} selectedThreadId={selectedThreadId} />
                    </div>
                </Stack>
                <div className="h-full">
                    {children}
                </div>
            </SplitView>
            <WorkerDeleteModal workerId={workerid} worker={worker} />
        </>
    )
}
