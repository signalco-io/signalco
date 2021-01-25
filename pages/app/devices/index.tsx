import React from "react";
import { useRouter } from 'next/router';
import { Box, Card, CardContent, CardHeader } from "@material-ui/core";
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
        identifier: device.identifier,
        lastActivity: device.states?.length > 0 ? <ReactTimeago date={device.states.map(s => s.timeStamp).sort()[0]} /> : 'Never'
    };
}

const Devices = () => {
    const router = useRouter();
    const [items, isLoading, error] = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/devices/${item.id}`);
    };

    return (
        <Box sx={{ maxWidth: { sm: '600px' }, py: 2, px: { sm: 2 }, height: 'calc(100vh - 48px)' }}>
            <Card style={{ height: '100%' }}>
                <CardHeader title="Devices" />
                <CardContent style={{ padding: 0, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    <AutoTable items={items} isLoading={isLoading} error={error} onRowClick={handleRowClick} />
                </CardContent>
            </Card>
        </Box>
    )
};

Devices.layout = AppLayout;

export default observer(Devices);