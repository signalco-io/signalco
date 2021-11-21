import React from "react";
import { useRouter } from 'next/router';
import { Box, Chip, Paper, Typography } from "@mui/material";
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

const Devices = () => {
    const router = useRouter();
    const itemsTable = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/devices/${item.id}`);
    };

    return (
        <Box sx={{ overflow: 'hidden', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Box sx={{ p: { sm: 0, md: 4 } }} height="100%">
                <Paper sx={{ maxWidth: '680px', height: '100%' }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h2" sx={{ p: 2 }}>Entities</Typography>
                        <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
                            <AutoTable {...itemsTable} onRowClick={handleRowClick} />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
};

Devices.layout = AppLayoutWithAuth;

export default observer(Devices);