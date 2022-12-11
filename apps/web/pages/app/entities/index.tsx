import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Add, LayoutGrid, LayoutList } from '@signalco/ui-icons';
import { Loadable, Row, Avatar, Button, IconButton, TextField, Typography, Box, Grid } from '@signalco/ui';
import { Stack } from '@mui/system';
import { KnownPages } from '../../../src/knownPages';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useLocale from '../../../src/hooks/useLocale';
import useAllEntities from '../../../src/hooks/signalco/useAllEntities';
import { entityUpsertAsync } from '../../../src/entity/EntityRepository';
import SelectItems from '../../../components/shared/form/SelectItems';
import Picker from '../../../components/shared/form/Picker';
import { EntityIconByType } from '../../../components/shared/entity/EntityIcon';
import ConfigurationDialog from '../../../components/shared/dialog/ConfigurationDialog';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import EntityCard from '../../../components/entity/EntityCard';

const entityTypes = [
    { value: '1', label: 'Devices' },
    { value: '2', label: 'Dashboards' },
    { value: '3', label: 'Process' },
    { value: '4', label: 'Stations' },
    { value: '5', label: 'Channels' }
];

const entityType = [
    { value: 1, label: 'Device' },
    { value: 2, label: 'Dashboard' },
    { value: 3, label: 'Process' },
    { value: 4, label: 'Station' },
    { value: 5, label: 'Channel' }
];

function EntityCreate() {
    const router = useRouter();
    const { t } = useLocale('App', 'Entities', 'NewEntityDialog');
    const { t: tType } = useLocale('Global', 'Entity', 'Types');

    const onType = async (type: { value: number, label: string }) => {
        const id = await entityUpsertAsync(undefined, type.value, 'New ' + tType(type.label));
        router.push(`${KnownPages.Entities}/${id}`);
    };

    return (
        <Stack spacing={2}>
            <Typography level="body2">{t('PickTypeHeader')}</Typography>
            <Stack spacing={1}>
                {entityType.map(type => (
                    <Button key={type.value} onClick={() => onType(type)}>{tType(type.label)}</Button>
                ))}
            </Stack>
        </Stack>
    );
}

function Entities() {
    const entities = useAllEntities();
    const entityItems = entities.data;
    const { t } = useLocale('App', 'Entities');
    const [entityListViewType, setEntityListViewType] = useUserSetting<string>('entityListViewType', 'table');
    const [filteredItems, searchText, handleSearchTextChange] = useSearch(entityItems, filterFuncObjectStringProps);

    const [selectedType, setSelectedType] = useState<string | undefined>('1');
    const typedItems = useMemo(() => filteredItems.filter(e => {
        return e.type.toString() === selectedType;
    }
    ), [filteredItems, selectedType]);

    const columns = useMemo(() => ({
        xs: entityListViewType === 'table' ? 12 : 6,
        sm: entityListViewType === 'table' ? 12 : 4,
        lg: entityListViewType === 'table' ? 12 : 3,
        xl: entityListViewType === 'table' ? 12 : 2
    }), [entityListViewType]);

    const results = useMemo(() => (
        <Box sx={{ px: 2 }}>
            <Grid container spacing={1}>
                {typedItems.map(entity => (
                    <Grid key={entity.id} {...columns}>
                        <EntityCard entity={entity} spread={entityListViewType === 'table'} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    ), [columns, entityListViewType, typedItems]);

    const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
    const handleAddEntity = () => setIsAddEntityOpen(true);

    return (
        <>
            <Stack spacing={{ xs: 2, sm: 4 }} sx={{ pt: { xs: 0, sm: 2 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2 }}>
                    <SelectItems
                        minWidth={220}
                        value={selectedType ? [selectedType] : []}
                        onChange={(v) => setSelectedType(v[0])}
                        items={entityTypes.map(t => {
                            const Icon = EntityIconByType(parseInt(t.value));
                            return ({
                                value: t.value, label: t.label, content: (
                                    <Row spacing={1}>
                                        <Avatar><Icon /></Avatar>
                                        <Typography>{t.label}</Typography>
                                    </Row>
                                )
                            });
                        })}
                        heading />
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, sm: 0 } }} justifyContent="end">
                        <TextField
                            placeholder={t('SearchLabel')}
                            value={searchText}
                            size="lg"
                            onChange={(e) => handleSearchTextChange(e.target.value)}
                            sx={{ width: { xs: '100%', sm: 'initial' } }} />
                        <Picker value={entityListViewType} onChange={(_, value) => setEntityListViewType(value)} options={[
                            { value: 'table', label: <LayoutList /> },
                            { value: 'cards', label: <LayoutGrid /> }
                        ]} />
                        <IconButton size="lg" onClick={handleAddEntity}><Add /></IconButton>
                    </Stack>
                </Stack>
                <Stack>
                    <Loadable isLoading={entities.isLoading} error={entities.error}>
                        {results}
                    </Loadable>
                </Stack>
            </Stack>
            <ConfigurationDialog isOpen={isAddEntityOpen} header={t('NewEntityDialogTitle')} onClose={() => setIsAddEntityOpen(false)}>
                <EntityCreate />
            </ConfigurationDialog>
        </>
    );
}

Entities.layout = AppLayoutWithAuth;

export default Entities;
