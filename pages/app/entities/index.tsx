import React, { useDeferredValue, useEffect, useMemo } from 'react';
import { Avatar, Box, ButtonBase, Grid, NoSsr, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import { IDeviceModel } from '../../../src/devices/Device';
import { observer } from 'mobx-react-lite';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import useAllEntities from '../../../src/hooks/useAllEntities';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TvIcon from '@mui/icons-material/Tv';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import PowerIcon from '@mui/icons-material/Power';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Link from 'next/link';
import useSearch, { filterFuncObjectStringProps } from '../../../src/hooks/useSearch';
import useUserSetting from '../../../src/hooks/useUserSetting';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import useLocale from '../../../src/hooks/useLocale';
import Loadable from '../../../components/shared/Loadable/Loadable';
import Timeago from '../../../components/shared/time/Timeago';
import useTilg from 'tilg';

const EntityIcon = (entity: IDeviceModel) => {
    let Icon = DevicesOtherIcon;
    if (entity.alias.toLowerCase().indexOf('light') >= 0 ||
        entity.alias.toLowerCase().indexOf('lamp') >= 0 ||
        entity.alias.toLowerCase().indexOf('svijetlo') >= 0) {
        Icon = LightbulbIcon;
    } else if (entity.alias.toLowerCase().indexOf('temp') >= 0) {
        Icon = ThermostatIcon;
    } else if (entity.alias.toLowerCase().indexOf('motion') >= 0) {
        Icon = DirectionsRunIcon;
    } else if (entity.alias.toLowerCase().indexOf('tv') >= 0) {
        Icon = TvIcon;
    } else if (entity.alias.toLowerCase().indexOf('door') >= 0 ||
        entity.alias.toLowerCase().indexOf('vrata') >= 0) {
        Icon = MeetingRoomIcon;
    } else if (entity.alias.toLowerCase().indexOf('window') >= 0 ||
        entity.alias.toLowerCase().indexOf('prozor') >= 0) {
        Icon = SensorWindowIcon;
    } else if (entity.alias.toLowerCase().indexOf('socket') >= 0) {
        Icon = PowerIcon;
    } else if (entity.alias.toLowerCase().indexOf('flower') >= 0) {
        Icon = LocalFloristIcon;
    } else if (entity.alias.toLowerCase().indexOf('button') >= 0) {
        Icon = RadioButtonCheckedIcon;
    } else if (entity.alias.toLowerCase().indexOf('heat') >= 0) {
        Icon = WhatshotIcon;
    } else if (entity.alias.toLowerCase().indexOf('switch') >= 0) {
        Icon = PowerSettingsNewIcon;
    }
    return Icon;
}

const EntityCard = (props: { entity: IDeviceModel }) => {
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
                                    <ShareEntityChip entityType={2} entity={entity} disableAction />
                                    <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}><Timeago date={entity.getLastActivity()} /></Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </ButtonBase>
            </Link>
        </Grid>
    );
}

const EntityTableName = (props: { entity: IDeviceModel }) => {
    const { entity } = props;
    const Icon = EntityIcon(entity);
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Avatar><Icon /></Avatar>
            <Typography noWrap sx={{ opacity: 0.9 }}>{entity.alias}</Typography>
        </Stack>
    );
};

function deviceModelToTableItem(entity: IDeviceModel): IAutoTableItem {
    return {
        id: entity.id,
        name: <EntityTableName entity={entity} />,
        shared: <ShareEntityChip entity={entity} entityType={1} />,
        lastActivity: <Box style={{ opacity: 0.8 }}><Timeago date={entity.getLastActivity()} /></Box>,
        _link: `/app/entities/${entity.id}`
    };
}

const Entities = () => {
    const entities = useAllEntities();
    const entityItems = entities.items;
    const { t } = useLocale('App', 'Entities');
    const [entityListViewType, setEntityListViewType] = useUserSetting<string>('entityListViewType', 'table');
    const [filteredItems, showSearch, searchText, handleSearchTextChange] = useSearch(entityItems, filterFuncObjectStringProps);

    const filteredItemsMapped = useMemo(() => {
        return filteredItems.map(deviceModelToTableItem);
    }, [filteredItems]);

    const results = useMemo(() => (
        <>
            {entityListViewType === 'table' ? (
                <AutoTable hideSearch items={filteredItemsMapped} isLoading={entities.isLoading} error={entities.error} localize={t} />
            ) : (
                <Box sx={{ px: 2 }}>
                    <Grid container spacing={2}>
                        {!entities.isLoading && filteredItems.map(entity => (
                            <EntityCard key={entity.id} entity={entity} />
                        ))}
                    </Grid>
                </Box>
            )}
        </>
    ), [entities.error, entities.isLoading, entityListViewType, filteredItems, filteredItemsMapped, t])

    return (
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
                </Stack>
            </Stack>
            <Loadable isLoading={entities.isLoading} error={entities.error} placeholder="linear">
                {results}
            </Loadable>
        </Stack>
    );
};

Entities.layout = AppLayoutWithAuth;

export default observer(Entities);
