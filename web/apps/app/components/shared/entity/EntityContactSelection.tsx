import React from 'react';
import {
    Loadable, NoDataPlaceholder, List,
    ListItem,
    ListItemButton, Box
} from '@signalco/ui';
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
        return <Box sx={{ p: 2 }}><NoDataPlaceholder content={'No applicable contacts available'} /></Box>;
    }

    return (
        <Loadable isLoading={isLoading} loadingLabel="Loading contacts" error={error}>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => handleContactSelected({ entityId: target.entityId })} selected={!target.contactName || !target.channelName}>
                        None
                    </ListItemButton>
                </ListItem>
                {contacts.map(c => (
                    <ListItem key={`${c.channelName}-${c.contactName}`}>
                        <ListItemButton onClick={() => handleContactSelected(c)} selected={target.channelName === c.channelName && target.contactName === c.contactName}>
                            {c.contactName}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
}
