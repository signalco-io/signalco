import { Paper, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import ReactTimeago from "react-timeago";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import BeaconsRepository, { IBeaconModel } from "../../../src/beacons/BeaconsRepository";

function beaconModelToTableItem(beacon: IBeaconModel): IAutoTableItem {
    return {
        id: beacon.id,
        name: beacon.id,
        version: beacon.version ?? "Unknown",
        registeredDate: <ReactTimeago date={beacon.registeredTimeStamp} />
    };
}

const Beacons = () => {
    const router = useRouter();
    const beaconsTable = useAutoTable(BeaconsRepository.getBeaconsAsync, beaconModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/stations/${item.id}`);
    };

    return (
        <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            <Stack sx={{ height: '100%' }}>
                <Typography variant="h2" sx={{ p: 2 }}>Stations</Typography>
                <AutoTable {...beaconsTable} onRowClick={handleRowClick} />
            </Stack>
        </Paper>
    )
}

Beacons.layout = AppLayoutWithAuth;

export default Beacons;