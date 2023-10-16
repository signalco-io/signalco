'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cx } from 'classix';
import { useQueryClient } from '@tanstack/react-query';
import { Add, Check, LayoutGrid, LayoutList } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { SelectItems } from '@signalco/ui/dist/SelectItems';
import { Row } from '@signalco/ui/dist/Row';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { KnownPages } from '../../src/knownPages';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale from '../../src/hooks/useLocale';
import useAllEntities from '../../src/hooks/signalco/entity/useAllEntities';
import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityDeleteAsync, entityUpsertAsync } from '../../src/entity/EntityRepository';
import SearchInput from '../../components/shared/inputs/SearchInput';
import ConfirmDeleteButton from '../../components/shared/dialog/ConfirmDeleteButton';
import EntityCard from '../../components/entity/EntityCard';

export default function Entities() {
    const { t: tType } = useLocale('Global', 'Entity', 'Types');
    const router = useRouter();
    const [selectedType] = useSearchParam('type', '1');
    const entities = useAllEntities(parseInt(selectedType, 10) || 1);

    const [entityListViewType, setEntityListViewType] = useUserSetting<string>('entityListViewType', 'table');
    const [filteredItems, setFilteredItems] = useState<IEntityDetails[] | undefined>(entities.data);

    const [isSelecting, setIsSelecting] = useState(false);
    const [selected, setSelected] = useState<IEntityDetails[]>([]);
    const handleToggleSelection = () => {
        setIsSelecting(!isSelecting);
    };
    const handleEntitySelection = useCallback((entity: IEntityDetails) => {
        if (!selected.find(e => e.id === entity.id)) {
            setSelected([...selected, entity]);
        } else {
            setSelected(selected.filter(e => e.id !== entity.id));
        }
    }, [selected]);

    const queryClient = useQueryClient();
    const handleConfirmDeleteSelected = async () => {
        await Promise.all(selected.map(e => entityDeleteAsync(e.id)));
        queryClient.invalidateQueries(['entities']);
        queryClient.invalidateQueries(['entities', parseInt(selectedType, 10)]);
        setSelected([]);
    };

    const typedItems = useMemo(() => filteredItems?.filter(e => {
        return e.type.toString() === selectedType;
    }), [filteredItems, selectedType]);

    const results = useMemo(() => (
        <div className={cx(
            'grid auto-cols-max gap-2',
            entityListViewType === 'table'
                ? 'grid-cols-1'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        )}>
            {typedItems?.map(entity => (
                <EntityCard
                    key={entity.id}
                    entity={entity}
                    spread={entityListViewType === 'table'}
                    selectable={isSelecting}
                    selected={!!selected.find(e => e.id === entity.id)}
                    onSelection={() => handleEntitySelection(entity)} />
            ))}
        </div>
    ), [entityListViewType, handleEntitySelection, isSelecting, selected, typedItems]);

    const handleCreateEntity = async () => {
        const id = await entityUpsertAsync(undefined, parseInt(selectedType), 'New ' + tType(selectedType));
        router.push(`${KnownPages.Entities}/${id}`);
    }

    return (
        <Stack spacing={1} className="p-2">
            <Stack spacing={1}>
                <Row justifyContent="space-between">
                    <Row spacing={1} className="grow" justifyContent="end">
                        <SearchInput items={entities.data} onFilteredItems={setFilteredItems} />
                        <SelectItems
                            value={entityListViewType}
                            onValueChange={setEntityListViewType}
                            items={[
                                { value: 'table', label: <LayoutList /> },
                                { value: 'cards', label: <LayoutGrid /> }
                            ]} />
                        <IconButton onClick={handleCreateEntity}><Add /></IconButton>
                        <IconButton onClick={handleToggleSelection}><Check /></IconButton>
                    </Row>
                </Row>
                {isSelecting && (
                    <Row>
                        <ConfirmDeleteButton
                            expectedConfirmText="confirm"
                            buttonLabel="Delete selected"
                            header={`Delete ${selected.length} entities`}
                            onConfirm={handleConfirmDeleteSelected} />
                    </Row>
                )}
            </Stack>
            <Stack>
                <Loadable isLoading={entities.isLoading} loadingLabel="Loading entities" error={entities.error}>
                    {results}
                </Loadable>
            </Stack>
        </Stack>
    );
}
