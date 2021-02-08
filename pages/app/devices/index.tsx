import React from "react";
import { useRouter } from 'next/router';
import { Box, Card, CardHeader, CardMedia, Grid, Typography } from "@material-ui/core";
import AppLayout from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { IDeviceModel } from "../../../src/devices/Device";
import DevicesRepository from "../../../src/devices/DevicesRepository";
import ReactTimeago from "react-timeago";
import { observer } from "mobx-react-lite";

function deviceModelToTableItem(device: IDeviceModel): IAutoTableItem {
    return {
        id: device.id,
        name: device.alias,
        lastActivity: device.states?.length > 0 ? <ReactTimeago date={device.states.map(s => s.timeStamp).sort()[0]} /> : 'Never'
    };
}

const Devices = () => {
    const router = useRouter();
    const [items, isLoading, error] = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/devices/${item.id}`);
    };

    return (
        <div style={{ margin: '24px', overflow: 'hidden', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Box sx={{ backgroundColor: '#333', maxWidth: '680px', height: '100%' }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h2" sx={{ p: 2 }}>Devices</Typography>
                    <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
                        <AutoTable items={items} isLoading={isLoading} error={error} onRowClick={handleRowClick} />
                    </Box>
                </Box>
            </Box>
        </div>
    )
};

Devices.layout = AppLayout;

export default observer(Devices);