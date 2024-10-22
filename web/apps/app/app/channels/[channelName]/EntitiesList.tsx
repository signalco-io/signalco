'use client';

import { useMemo } from 'react';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { ChannelDataItem } from '@signalco/data/data';
import { KnownPages } from '../../../src/knownPages';
import useAllEntities from '../../../src/hooks/signalco/entity/useAllEntities';

// TODO: Merge with Entities list shared component

export default function EntitiesList({ channel }: { channel: ChannelDataItem }) {
    const entities = useAllEntities();
    const connectedChannels = useMemo(() => entities.data?.filter(e => e?.contacts.filter(c => c.channelName === channel?.channelName).length), [channel?.channelName, entities]);

    return (
        <Loadable isLoading={entities.isLoading} error={entities.error} loadingLabel="Loading entities">
            {(connectedChannels?.length ?? 0) > 0
                ? (
                    <List>
                        {connectedChannels?.map(c => (
                            <ListItem
                                key={c.id}
                                href={`${KnownPages.Entities}/${c.id}`}
                                label={c.alias || c.id} />
                        ))}
                    </List>
                ) : (
                    <NoDataPlaceholder>
                        No items
                    </NoDataPlaceholder>
                )}
        </Loadable>
    );
}