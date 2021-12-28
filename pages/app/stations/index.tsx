import { Typography, Stack } from "@mui/material";
import React from "react";
import ReactTimeago from "react-timeago";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import BeaconsRepository, { IBeaconModel } from "../../../src/beacons/BeaconsRepository";

function beaconModelToTableItem(station: IBeaconModel): IAutoTableItem {
    return {
        id: station.id,
        name: station.id,
        version: station.version ?? "Unknown",
        lastActivity: station.stateTimeStamp ? <ReactTimeago date={station.stateTimeStamp} /> : "Unknown",
        registeredDate: <ReactTimeago date={station.registeredTimeStamp} />,
        _link: `/app/stations/${station.id}`
    };
}

const Beacons = () => {
    const beaconsTable = useAutoTable(BeaconsRepository.getBeaconsAsync, beaconModelToTableItem);

    return (
        <Stack spacing={{ xs: 0, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}>Stations</Typography>
            <AutoTable {...beaconsTable} />
        </Stack>
    )
}

Beacons.layout = AppLayoutWithAuth;

export default Beacons;