import React from "react";
import { useRouter } from 'next/router';
import { Paper, Stack, Typography } from "@mui/material";
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { observer } from "mobx-react-lite";
import ProcessesRepository, { IProcessModel } from "../../../src/processes/ProcessesRepository";
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import BlockSharpIcon from '@mui/icons-material/BlockSharp';

function deviceModelToTableItem(process: IProcessModel): IAutoTableItem {
    return {
        id: process.id,
        name: process.alias,
        enabled: !process.isDisabled ? <CheckSharpIcon /> : <BlockSharpIcon />,
        _opacity: process.isDisabled ? 0.5 : 1
    };
}

const Processes = () => {
    const router = useRouter();
    const itemsTable = useAutoTable(ProcessesRepository.getProcessesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/processes/${item.id}`);
    };

    return (
        <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            <Stack sx={{ height: '100%' }}>
                <Typography variant="h2" sx={{ p: 2 }}>Processes</Typography>
                <AutoTable {...itemsTable} onRowClick={handleRowClick} />
            </Stack>
        </Paper>
    )
};

Processes.layout = AppLayoutWithAuth;

export default observer(Processes);