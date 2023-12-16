import React from 'react';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import { ContactPointerRequiredEntity } from './DisplayEntityTarget';

export type EntityContactSelectionProps = {
    target: ContactPointerRequiredEntity;
    onSelected: (target: ContactPointerRequiredEntity) => void;
}

export default function EntityContactSelection(props: EntityContactSelectionProps) {
    const {
        target, onSelected
    } = props;

    const { data: entity, isLoading, error } = useEntity(target?.entityId);
    const contacts = entity?.contacts ?? [];

    const handleContactSelected = (contact: ContactPointerRequiredEntity) => {
        onSelected(contact);
    };

    if (!isLoading && !error && !contacts.length) {
        return (
            <div className="p-2">
                <NoDataPlaceholder>No applicable contacts available</NoDataPlaceholder>
            </div>
        );
    }

    return (
        <Loadable isLoading={isLoading} loadingLabel="Loading contacts" error={error}>
            <List>
                <ListItem
                    nodeId={`entity-contact-selection-${target.entityId}-none`}
                    onSelected={() => handleContactSelected({ entityId: target.entityId })}
                    selected={!target.contactName || !target.channelName}
                    label="None" />
                {contacts.map(c => (
                    <ListItem
                        key={`${c.channelName}-${c.contactName}`}
                        nodeId={`entity-contact-selection-${target.entityId}-${c.channelName}-${c.contactName}`}
                        onSelected={() => handleContactSelected(c)}
                        selected={target.channelName === c.channelName && target.contactName === c.contactName}
                        label={c.contactName} />
                ))}
            </List>
        </Loadable>
    );
}
