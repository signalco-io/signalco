import React from "react";
import { useRouter } from 'next/router';
import { Box, Paper, Typography } from "@mui/material";
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
        <Box sx={{ overflow: 'hidden', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Box sx={{ p: { sm: 0, md: 4 } }} height="100%">
                <Paper sx={{ maxWidth: '680px', height: '100%' }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h2" sx={{ p: 2 }}>Processes</Typography>
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <AutoTable {...itemsTable} onRowClick={handleRowClick} />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
};

Processes.layout = AppLayoutWithAuth;

export default observer(Processes);