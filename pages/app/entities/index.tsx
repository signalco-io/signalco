import React, { Suspense, useMemo, useState } from 'react';
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
import Picker from 'components/shared/form/Picker';
import EntityIcon from 'components/shared/entity/EntityIcon';
import ConfigurationDialog from 'components/shared/dialog/ConfigurationDialog';
import EntityStatus from 'components/entity/EntityStatus';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useLocale from '../../../src/hooks/useLocale';
import useAllEntities from '../../../src/hooks/useAllEntities';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import Loadable from '../../../components/shared/Loadable/Loadable';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';

function EntityCard(props: { entity: IEntityDetails }) {
    const { entity } = props;
    const Icon = EntityIcon(entity);
    return (
        <Grid xs={6} sm={4} lg={3}>
            <Link href={`/app/entities/${entity.id}`} passHref>
                <Card sx={{ width: '100%', bgcolor: 'background.default' }}>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>
                                <Icon />
                            </Avatar>
                            <Typography noWrap sx={{ opacity: 0.9 }}>{entity.alias}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EntityStatus entity={entity} />
                                <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                    <Timeago date={entityLastActivity(entity)} />
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Link>
        </Grid>
    );
}

function EntityTableName(props: { entity: IEntityDetails }) {
    const { entity } = props;
    const Icon = EntityIcon(entity);
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Avatar><Icon /></Avatar>
            <Typography noWrap sx={{ opacity: 0.9 }}>{entity.alias}</Typography>
        </Stack>
    );
}

function deviceModelToTableItem(entity: IEntityDetails): IAutoTableItem {
    return {
        id: entity.id,
        name: <EntityTableName entity={entity} />,
        shared: <ShareEntityChip entity={entity} entityType={1} />,
        lastActivity: (
            <Stack direction="row" alignItems="center" spacing={1}>
                <EntityStatus entity={entity} />
                <Timeago date={entityLastActivity(entity)} />
            </Stack>
        ),
        _link: `/app/entities/${entity.id}`
    };
}

function EntityCreate() {
    const router = useRouter();
    const { t } = useLocale('App', 'Entities', 'NewEntityDialog');
    const { t: tType } = useLocale('Global', 'Entity', 'Types');

    const onType = async (type: { value: number, label: string }) => {
        const id = await entityUpsertAsync(undefined, type.value, 'New ' + tType(type.label));
        router.push('/app/entities/' + id);
    };

    const types = [
        { value: 1, label: 'Device' },
        { value: 2, label: 'Dashboard' },
        { value: 3, label: 'Process' },
        { value: 4, label: 'Station' },
        { value: 5, label: 'Channel' }
    ];

    return (
        <Stack spacing={2}>
            <Typography level="body2">{t('PickTypeHeader')}</Typography>
            <Stack spacing={1}>
                {types.map(type => (
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

    const filteredItemsMapped = useMemo(() => {
        return filteredItems.map(deviceModelToTableItem);
    }, [filteredItems]);

    const results = useMemo(() => (
        <>
            {entityListViewType === 'table' ? (
                <AutoTable hideSearch items={filteredItemsMapped} localize={t} isLoading={false} error={undefined} />
            ) : (
                <Box sx={{ px: 2 }}>
                    <Grid container spacing={2}>
                        {filteredItems.map(entity => (
                            <EntityCard key={entity.id} entity={entity} />
                        ))}
                    </Grid>
                </Box>
            )}
        </>
    ), [entityListViewType, filteredItems, filteredItemsMapped, t])

    const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
    const handleAddEntity = () => setIsAddEntityOpen(true);

    return (
        <>
            <Stack spacing={{ xs: 2, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2 }}>
                    <Typography level="h2" fontWeight="300" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>{t('Entities')}</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexGrow: { xs: 1, sm: 0 } }} justifyContent="flex-end">
                        {showSearch && <TextField
                            label={t('SearchLabel')}
                            size="sm"
                            value={searchText}
                            onChange={(e) => handleSearchTextChange(e.target.value)}
                            sx={{ width: { xs: '100%', sm: 'initial' } }} />}
                        <Suspense>
                            <Picker value={entityListViewType} onChange={(_, value) => setEntityListViewType(value)} options={[
                                { value: 'table', label: <ViewListIcon /> },
                                { value: 'cards', label: <ViewModuleIcon /> }
                            ]} />
                        </Suspense>
                        <IconButton size="lg" onClick={handleAddEntity}><AddCircleIcon /></IconButton>
                    </Stack>
                </Stack>
                <Stack spacing={1}>
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
