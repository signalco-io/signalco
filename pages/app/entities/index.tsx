import React from "react";
import { Stack, Typography } from "@mui/material";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { IDeviceModel } from "../../../src/devices/Device";
import DevicesRepository from "../../../src/devices/DevicesRepository";
import ReactTimeago from "react-timeago";
import { observer } from "mobx-react-lite";
import ShareEntityChip from "../../../components/entity/ShareEntityChip";

function deviceModelToTableItem(device: IDeviceModel): IAutoTableItem {
    return {
        id: device.id,
        name: device.alias,
        lastActivity: device.states.length > 0 ? <ReactTimeago date={device.getLastActivity()} /> : 'Never',
        shared: <ShareEntityChip entity={device} entityType={1} />,
        _link: `/app/entities/${device.id}`
    };
}

const Entities = () => {
    const itemsTable = useAutoTable(DevicesRepository.getDevicesAsync, deviceModelToTableItem);

    return (
        <Stack spacing={{ xs: 0, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}>Entities</Typography>
            <AutoTable {...itemsTable} />
        </Stack>
    )
};

Entities.layout = AppLayoutWithAuth;

export default observer(Entities);