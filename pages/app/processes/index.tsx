import React from "react";
import { useRouter } from 'next/router';
import { Box, Card, CardContent, CardHeader } from "@material-ui/core";
import AppLayout from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { observer } from "mobx-react-lite";
import ProcessesRepository, { IProcessModel } from "../../../src/processes/ProcessesRepository";
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import BlockSharpIcon from '@material-ui/icons/BlockSharp';

function deviceModelToTableItem(device: IProcessModel): IAutoTableItem {
    return {
        id: device.id,
        name: device.alias,
        enabled: !device.isDisabled ? <CheckSharpIcon /> : <BlockSharpIcon />
    };
}

const Processes = () => {
    const router = useRouter();
    const [items, isLoading, error] = useAutoTable(ProcessesRepository.getProcessesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/processes/${item.id}`);
    };

    return (
        <Box sx={{ maxWidth: { sm: '600px' }, py: 2, px: { sm: 2 }, height: 'calc(100vh - 48px)' }}>
            <Card style={{ height: '100%' }}>
                <CardHeader title="Processes" />
                <CardContent style={{ padding: 0, height: 'calc(100% - 55px)', overflowY: 'auto' }}>
                    <AutoTable items={items} isLoading={isLoading} error={error} onRowClick={handleRowClick} />
                </CardContent>
            </Card>
        </Box>
    )
};

Processes.layout = AppLayout;

export default observer(Processes);