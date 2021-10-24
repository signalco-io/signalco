import { Box, Paper, Typography } from "@mui/material";
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
        router.push(`/app/beacons/${item.id}`);
    };

    return (
        <Box sx={{ overflow: 'hidden', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Box sx={{ p: { sm: 0, md: 4 } }} height="100%">
                <Paper sx={{ maxWidth: '680px', height: '100%' }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h2" sx={{ p: 2 }}>Beacons</Typography>
                        <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
                            <AutoTable {...beaconsTable} onRowClick={handleRowClick} />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

Beacons.layout = AppLayoutWithAuth;

export default Beacons;