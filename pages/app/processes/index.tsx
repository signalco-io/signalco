import React from "react";
import { Stack, Typography } from "@mui/material";
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
        _link: `/app/processes/${process.id}`,
        _opacity: process.isDisabled ? 0.5 : 1
    };
}

const Processes = () => {
    const itemsTable = useAutoTable(ProcessesRepository.getProcessesAsync, deviceModelToTableItem);

    return (
        <Stack spacing={{ mobile: 0, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { mobile: 'hidden', tablet: 'visible' } }}>Processes</Typography>
            <AutoTable {...itemsTable} />
        </Stack>
    )
};

Processes.layout = AppLayoutWithAuth;

export default observer(Processes);