import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Grid from '@mui/system/Unstable_Grid';
import { Box, Stack } from '@mui/system';
import { Avatar, Button, Card, IconButton, TextField, Typography } from '@mui/joy';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IEntityDetails from 'src/entity/IEntityDetails';
import { entityUpsertAsync } from 'src/entity/EntityRepository';
import { entityLastActivity } from 'src/entity/EntityHelper';
import Timeago from 'components/shared/time/Timeago';
import SelectItems from 'components/shared/form/SelectItems';
import Picker from 'components/shared/form/Picker';
import EntityIcon from 'components/shared/entity/EntityIcon';
import ConfigurationDialog from 'components/shared/dialog/ConfigurationDialog';
import EntityStatus, { useEntityStatus } from 'components/entity/EntityStatus';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useLocale from '../../../src/hooks/useLocale';
import useAllEntities from '../../../src/hooks/useAllEntities';
import Loadable from '../../../components/shared/Loadable/Loadable';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';


function EntityCard(props: { entity: IEntityDetails, spread: boolean }) {
    const { entity, spread } = props;
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const Icon = EntityIcon(entity);

    const columns = {
        xs: spread ? 12 : 6,
        sm: spread ? 12 : 4,
        lg: spread ? 12 : 3,
        xl: spread ? 12 : 2
    };

    return (
        <Grid {...columns}>
            <Link href={`/app/entities/${entity.id}`} passHref legacyBehavior>
                <Card variant="outlined" sx={spread ? { p: 1 } : {}}>
                    <Stack spacing={2} direction={spread ? 'row' : 'column'} justifyContent={spread ? 'space-between' : undefined}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar variant={spread ? 'plain' : 'soft'}>
                                <Icon />
                            </Avatar>
                            <Typography noWrap>{entity.alias}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ pr: spread ? 2 : 0 }}>
                                {(hasStatus && (isStale || isOffline)) && (
                                    <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                        <Timeago date={entityLastActivity(entity)} />
                                    </Box>
                                )}
                                <EntityStatus entity={entity} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Link>
        </Grid>
    );
}

const entityType = [
    { value: 1, label: 'Device' },
    { value: 2, label: 'Dashboard' },
    { value: 3, label: 'Process' },
    { value: 4, label: 'Station' },
    { value: 5, label: 'Channel' }
];

const entityTypes = [
    { value: '1', label: 'Devices' },
    { value: '2', label: 'Dashboards' },
    { value: '3', label: 'Processs' },
    { value: '4', label: 'Stations' },
    { value: '5', label: 'Channels' }
];

function EntityCreate() {
    const router = useRouter();
    const { t } = useLocale('App', 'Entities', 'NewEntityDialog');
    const { t: tType } = useLocale('Global', 'Entity', 'Types');

    const onType = async (type: { value: number, label: string }) => {
        const id = await entityUpsertAsync(undefined, type.value, 'New ' + tType(type.label));
        router.push('/app/entities/' + id);
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
    const [filteredItems, showSearch, searchText, handleSearchTextChange, isSearching] = useSearch(entityItems, filterFuncObjectStringProps);

    const [selectedType, setSelectedType] = useState<string | undefined>('1');
    const typedItems = useMemo(() => filteredItems.filter(e => {
        console.log(e.type.toString(), selectedType,)
        return e.type.toString() === selectedType;
    }
    ), [filteredItems, selectedType]);

    const results = useMemo(() => (
        <Box sx={{ px: 2 }}>
            <Grid container spacing={entityListViewType === 'table' ? 1 : 2}>
                {typedItems.map(entity => (
                    <EntityCard key={entity.id} entity={entity} spread={entityListViewType === 'table'} />
                ))}
            </Grid>
        </Box>
    ), [entityListViewType, typedItems]);

    const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
    const handleAddEntity = () => setIsAddEntityOpen(true);

    return (
        <>
            <Stack spacing={{ xs: 2, sm: 4 }} sx={{ pt: { xs: 0, sm: 2 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2 }}>
                    <SelectItems
                        value={selectedType ? [selectedType] : []}
                        onChange={(v) => setSelectedType(v[0])}
                        items={entityTypes.map(t => ({ value: t.value.toString(), label: t.label }))}
                        heading />
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, sm: 0 } }} justifyContent="end">
                        {showSearch && (
                            <TextField
                                placeholder={t('SearchLabel')}
                                value={searchText}
                                size="lg"
                                onChange={(e) => handleSearchTextChange(e.target.value)}
                                sx={{ width: { xs: '100%', sm: 'initial' } }} />
                        )}
                        <Picker value={entityListViewType} onChange={(_, value) => setEntityListViewType(value)} options={[
                            { value: 'table', label: <ViewListIcon /> },
                            { value: 'cards', label: <ViewModuleIcon /> }
                        ]} />
                        <IconButton size="lg" onClick={handleAddEntity}><AddCircleIcon /></IconButton>
                    </Stack>
                </Stack>
                <Stack>
                    <Loadable isLoading={entities.isLoading} error={entities.error}>
                        <Loadable isLoading={isSearching} contentVisible placeholder="linear" sx={{ px: 2 }}>
                            {results}
                        </Loadable>
                    </Loadable>
                </Stack>
            </Stack>
            <ConfigurationDialog isOpen={isAddEntityOpen} title={t('NewEntityDialogTitle')} onClose={() => setIsAddEntityOpen(false)}>
                <EntityCreate />
            </ConfigurationDialog>
        </>
    );
}

Entities.layout = AppLayoutWithAuth;

export default Entities;
