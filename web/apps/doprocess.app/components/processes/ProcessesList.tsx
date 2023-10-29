'use client';

import { Navigate } from '@signalco/ui-icons';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { List } from '@signalco/ui/dist/List';
import { KnownPages } from '../../src/knownPages';
import { useProcesses } from './useProcesses';

export function ProcessesList() {
    const { data: processes, isLoading, error } = useProcesses();

    return (
        <Loadable isLoading={isLoading} loadingLabel="Loading processes..." error={error}>
            <List>
                {!(processes?.length ?? 0) && <NoDataPlaceholder className="text-center">No processes. Start by creating new process.</NoDataPlaceholder>}
                {processes?.map((process) => (
                    <ListItem
                        key={process.id}
                        label={process.name}
                        endDecorator={<Navigate className="opacity-0 group-hover:opacity-100" />}
                        className="group w-full"
                        href={KnownPages.Process(process.id)} />
                ))}
            </List>
        </Loadable>
    );
}
