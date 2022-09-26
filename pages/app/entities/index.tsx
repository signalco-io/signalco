import React, { useMemo, useState } from 'react';
import { Avatar, Box, Button, ButtonBase, ButtonGroup, Grid, NoSsr, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import useAllEntities from '../../../src/hooks/useAllEntities';
import Link from 'next/link';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useUserSetting from '../../../src/hooks/useUserSetting';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import useLocale from '../../../src/hooks/useLocale';
import Loadable from '../../../components/shared/Loadable/Loadable';
import IEntityDetails from 'src/entity/IEntityDetails';
import EntityIcon from 'components/shared/entity/EntityIcon';
import Timeago from 'components/shared/time/Timeago';
import { entityLastActivity } from 'src/entity/EntityHelper';
import EntityStatus from 'components/entity/EntityStatus';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ConfigurationDialog from 'components/shared/dialog/ConfigurationDialog';
import { entityUpsertAsync } from 'src/entity/EntityRepository';
import { useRouter } from 'next/router';

function EntityCard(props: { entity: IEntityDetails }) {
    const { entity } = props;
    const Icon = EntityIcon(entity);
    return (
        <Grid item xs={6} sm={4} lg={3}>
            <Link href={`/app/entities/${entity.id}`} passHref>
                <ButtonBase sx={{ width: '100%', borderRadius: 2 }}>
                    <Paper sx={{ width: '100%', bgcolor: 'background.default' }}>
                        <Box p={2}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar variant="circular">
                                        <Icon />
                                    </Avatar>
                                    <Typography noWrap sx={{ opacity: 0.9 }}>{entity.alias}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <div>
                                        <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                                    </div>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EntityStatus entity={entity} />
                                        <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                            <Timeago date={entityLastActivity(entity)} />
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </ButtonBase>
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
                <Box style={{ opacity: 0.8 }}>
                    <Timeago date={entityLastActivity(entity)} />
                </Box>
            </Stack>
        ),
        _link: `/app/entities/${entity.id}`
    };
}

function EntityCreate() {
    const router = useRouter();
    const { t } = useLocale('App', 'Entities', 'NewEntityDialog');

    const onType = async (type: {value: number, label: string}) => {
        const id = await entityUpsertAsync(undefined, type.value, 'New ' + t('Types.' + type.label));
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
            <Typography variant="body2" color="textSecondary">{t('PickTypeHeader')}</Typography>
            <ButtonGroup orientation="vertical">
                {types.map(type => (
                    <Button key={type.value} onClick={() => onType(type)}>{t('Types.' + type.label)}</Button>
                ))}
            </ButtonGroup>
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
                <Typography variant="h2" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>{t('Entities')}</Typography>
                <Stack direction="row" spacing={1} sx={{ flexGrow: { xs: 1, sm: 0 } }} justifyContent="flex-end">
                    {showSearch && <TextField
                        label={t('SearchLabel')}
                        size="small"
                        value={searchText}
                        variant="filled"
                        onChange={(e) => handleSearchTextChange(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 'initial' } }} />}
                    <NoSsr>
                        <ToggleButtonGroup exclusive value={entityListViewType} color="primary" onChange={(_, value) => setEntityListViewType(value)}>
                            <ToggleButton value="table" size="small" title="List view"><ViewListIcon /></ToggleButton>
                            <ToggleButton value="cards" size="small" title="Card view"><ViewModuleIcon /></ToggleButton>
                        </ToggleButtonGroup>
                    </NoSsr>
                    <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddEntity}>{t('NewEntity')}</Button>
                </Stack>
            </Stack>
            <Stack spacing={1}>
                <Loadable isLoading={entities.isLoading} error={entities.error}>
                    <Loadable isLoading={isSearching} contentVisible placeholder="linear" sx={{px: 2}}>
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
