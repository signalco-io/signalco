import React from "react";
import { useRouter } from 'next/router';
import { Card, CardHeader, CardMedia, Grid } from "@material-ui/core";
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
        <Grid container sx={{ height: '100%' }}>
            <Grid item sm={12} md={8} lg={6} sx={{ height: '100%' }}>
                <Card style={{ background: 'transparent', height: '100%', overflow: 'hidden' }}>
                    <CardHeader title="Devices" />
                    <CardMedia style={{ height: '100%' }}>
                        <AutoTable items={items} isLoading={isLoading} error={error} onRowClick={handleRowClick} />
                    </CardMedia>
                </Card>
            </Grid>
        </Grid>
    )
};

Devices.layout = AppLayout;

export default observer(Devices);