import React from "react";
import { useRouter } from 'next/router';
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
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
        shared: device.sharedWith.length > 1 && <Chip icon={<PeopleAltSharpIcon fontSize="small" />} label={device.sharedWith.length} />
    };
}

const Entities = () => {
    const router = useRouter();
    const itemsTable = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/entities/${item.id}`);
    };

    return (
        <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            <Stack>
                <Typography variant="h2" sx={{ p: 2 }}>Entities</Typography>
                <AutoTable {...itemsTable} onRowClick={handleRowClick} />
            </Stack>
        </Paper>
    )
};

Entities.layout = AppLayoutWithAuth;

export default observer(Entities);