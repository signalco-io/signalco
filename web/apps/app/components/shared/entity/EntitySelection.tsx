import React, { useMemo, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Input } from '@signalco/ui-primitives/Input';
import { Loadable } from '@signalco/ui/Loadable';
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
                    <Input
                        autoFocus
                        className="w-full"
                        placeholder="Search..."
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <List>
                    <ListItem
                        nodeId={`entity-contact-selection-${target?.entityId}-none`}
                        onSelected={() => handleEntitySelected(undefined)}
                        selected={!target?.entityId}
                        label="None" />
                    {filteredEntities?.map(entity => (
                        <ListItem
                            key={entity.id}
                            nodeId={`entity-contact-selection-${target?.entityId}-${entity.id}`}
                            label={entity.alias}
                            onSelected={() => handleEntitySelected(entity)}
                            selected={target?.entityId === entity.id} />
                    ))}
                </List>
            </Stack>
        </Loadable>
    );
}
