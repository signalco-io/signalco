import React, { useMemo, useState } from 'react';
import { TextField } from '@signalco/ui/dist/TextField';
import { Stack } from '@signalco/ui/dist/Stack';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { List, ListItem, ListItemButton } from '@signalco/ui/dist/List';
import useAllEntities from '../../../src/hooks/signalco/entity/useAllEntities';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';

export type EntitySelectionProps = {
    target: Partial<IContactPointer> | undefined;
    onSelected: (target: Partial<IContactPointer> | undefined) => void;
};

export default function EntitySelection({ target, onSelected }: EntitySelectionProps) {
    const entities = useAllEntities();
    const handleEntitySelected = (selectedEntity: IEntityDetails | undefined) => {
        onSelected(selectedEntity ? { entityId: selectedEntity.id } : undefined);
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredEntities = useMemo(() => {
        return searchTerm
            ? entities.data?.filter(e => e.alias.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
            : entities.data;
    }, [searchTerm, entities.data]);

    return (
        <Loadable isLoading={entities.isLoading} loadingLabel="Loading entity" error={entities.error}>
            <Stack spacing={1}>
                <div className="p-2">
                    <TextField autoFocus fullWidth placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => handleEntitySelected(undefined)} selected={!target?.entityId}>
                            None
                        </ListItemButton>
                    </ListItem>
                    {filteredEntities?.map(entity => (
                        <ListItem key={entity.id}>
                            <ListItemButton onClick={() => handleEntitySelected(entity)} selected={target?.entityId === entity.id}>
                                {entity.alias}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Loadable>
    );
}
