'use client';

import { PropsWithChildren } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { AI } from '@signalco/ui-icons';
import { QueryList, QueryListItem } from '@signalco/ui/QueryList';
import { KnownPages } from '../../../../src/knownPages';

function useWorkers() {
    return {
        data: [{
            id: 'asst_Mm1BbGNfwG3KidVHfEUivwBM',
            name: 'Junior Bookkeper'
        }],
        isLoading: false,
    };
}

export type PartyWorker = {
    id: string;
    name: string;
};

type WorkersListItemProps = {
    worker: PartyWorker;
};

export function WorkersListItem({ worker }: WorkersListItemProps) {
    return (
        <QueryListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{worker.name}</Typography>
                </Stack>
            )}
            startDecorator={<AI />}
            className="group w-full"
            href={KnownPages.AppWorker(worker.id)} />
    );
}

function WorkersListEmptyPlaceholder() {
    return (
        <div>
            No workers
        </div>
    );
}

function WorkersList() {
    const workers = useWorkers();

    return (
        <QueryList
            query={() => workers}
            itemRender={(item) => (<WorkersListItem worker={item} />)}
            emptyPlaceholder={<WorkersListEmptyPlaceholder />}
        />
    );
}

export default function AppWorkersLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-row items-start">
            <WorkersList />
            <div className="grow">
                {children}
            </div>
        </div>
    )
}
