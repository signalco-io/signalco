import React from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { IDeviceModel } from "../../../src/devices/Device";
import DevicesRepository from "../../../src/devices/DevicesRepository";
import ReactTimeago from "react-timeago";
import { observer } from "mobx-react-lite";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';

function deviceModelToTableItem(device: IDeviceModel): IAutoTableItem {
    return {
        id: device.id,
        name: device.alias,
        lastActivity: device.states.length > 0 ? <ReactTimeago date={device.getLastActivity()} /> : 'Never',
        shared: device.sharedWith.length > 1 && <Chip icon={<PeopleAltSharpIcon fontSize="small" />} label={device.sharedWith.length} />,
        _link: `/app/entities/${device.id}`
    };
}

const Entities = () => {
    const itemsTable = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    return (
        <Stack spacing={{ mobile: 0, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { mobile: 'hidden', tablet: 'visible' } }}>Entities</Typography>
            <AutoTable {...itemsTable} />
        </Stack>
    )
};

Entities.layout = AppLayoutWithAuth;

export default observer(Entities);