import React from "react";
import { Avatar, Box, ButtonBase, Grid, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import { IDeviceModel } from "../../../src/devices/Device";
import ReactTimeago from "react-timeago";
import { observer } from "mobx-react-lite";
import ShareEntityChip from "../../../components/entity/ShareEntityChip";
import useAllEntities from "../../../src/hooks/useAllEntities";
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
import Link from "next/link";
import useSearch, { filterFuncObjectStringProps } from "../../../src/hooks/useSearch";
import useUserSetting from "../../../src/hooks/useUserSetting";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import DevicesRepository from "../../../src/devices/DevicesRepository";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

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
                    <Paper sx={{ width: '100%' }}>
                        <Box p={2}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar variant="circular">
                                        <Icon />
                                    </Avatar>
                                    <Typography noWrap sx={{ opacity: 0.8 }}>{entity.alias}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <ShareEntityChip entityType={2} entity={entity} disableAction />
                                    <Box style={{ opacity: 0.6, fontSize: '0.8rem' }}>{entity.states.length > 0 ? <ReactTimeago date={entity.getLastActivity()} /> : 'Never'}</Box>
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
        <Stack direction="row" spacing={1} alignItems="center"><Icon /><span>{entity.alias}</span></Stack>
    );
};

function deviceModelToTableItem(device: IDeviceModel): IAutoTableItem {
    return {
        id: device.id,
        name: <EntityTableName entity={device} />,
        lastActivity: device.states.length > 0 ? <ReactTimeago date={device.getLastActivity()} /> : 'Never',
        shared: <ShareEntityChip entity={device} entityType={1} />,
        _link: `/app/entities/${device.id}`
    };
}

const Entities = () => {
    const entities = useAllEntities();
    const [entityListViewType, setEntityListViewType] = useUserSetting<string>('entityListViewType', 'table');

    // Card view
    const [filteredItems, showSearch, searchText, handleSearchTextChange] = useSearch(entities.items, filterFuncObjectStringProps);

    // Table view
    const itemsTable = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    return (
        <Stack spacing={{ xs: 2, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 }, px: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h2" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>Entities</Typography>
                <Stack direction="row" spacing={1}>
                    <ToggleButtonGroup exclusive value={entityListViewType} onChange={(_, value) => setEntityListViewType(value)}>
                        <ToggleButton value="table" size="small"><ViewListIcon /></ToggleButton>
                        <ToggleButton value="cards" size="small"><ViewModuleIcon /></ToggleButton>
                    </ToggleButtonGroup>
                    {(entityListViewType !== 'table' && showSearch) && <TextField
                        label="Search..."
                        size="small"
                        value={searchText}
                        onChange={(e) => handleSearchTextChange(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 'initial' } }} />}
                </Stack>
            </Stack>
            {entityListViewType === 'table' ? (
                <AutoTable {...itemsTable} />
            ) : (
                <Box>
                    <Grid container spacing={2}>
                        {filteredItems.map(entity => (
                            <EntityCard key={entity.id} entity={entity} />
                        ))}
                    </Grid>
                </Box>
            )}
        </Stack>
    );
};

Entities.layout = AppLayoutWithAuth;

export default observer(Entities);