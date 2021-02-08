import React from "react";
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardMedia, Grid } from "@material-ui/core";
import AppLayout from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from "../../../components/shared/table/AutoTable";
import useAutoTable from "../../../components/shared/table/useAutoTable";
import { observer } from "mobx-react-lite";
import ProcessesRepository, { IProcessModel } from "../../../src/processes/ProcessesRepository";
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import BlockSharpIcon from '@material-ui/icons/BlockSharp';

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
    const [items, isLoading, error] = useAutoTable(ProcessesRepository.getProcessesAsync, deviceModelToTableItem);

    const handleRowClick = (item: IAutoTableItem) => {
        router.push(`/app/processes/${item.id}`);
    };

    return (
        <Grid container direction="row">
            <Grid item xs={12} md={8} lg={6} sx={{height: '100%'}}>
                <Card style={{ background: 'transparent', height: '100%', width: '100%' }}>
                    <CardHeader title="Processes" />
                    <CardMedia>
                        <AutoTable items={items} isLoading={isLoading} error={error} onRowClick={handleRowClick} />
                    </CardMedia>
                </Card>
            </Grid>
        </Grid>
    )
};

Processes.layout = AppLayout;

export default observer(Processes);