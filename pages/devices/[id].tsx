import { Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../components/AppLayout";
import AutoTable from '../../components/shared/table/AutoTable';
import { IDeviceModel } from '../../src/devices/Device';
import DevicesRepository from '../../src/devices/DevicesRepository';
import RefreshSharpIcon from '@material-ui/icons/RefreshSharp';
import { observer } from 'mobx-react-lite';

const DeviceDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [device, setDevice] = useState<IDeviceModel | undefined>();

    const loadDeviceAsync = async () => {
        if (typeof id !== "object" &&
            typeof id !== 'undefined') {
            console.log('loading device...');
            const loadedDevice = await DevicesRepository.getDeviceAsync(id);
            console.log(loadedDevice);
            setDevice(loadedDevice);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDeviceAsync();
    }, [id]);

    const handleRefresh = () => {
        loadDeviceAsync();
    };

    const stateTableItems = device?.states.map(s => {
        return {
            id: `${s.channel}-${s.name}`,
            channel: s.channel,
            name: s.name,
            value: s.valueSerialized,
            lastUpdate: <ReactTimeago date={s.timeStamp} live />
        }
    });

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Grid container spacing={2} direction="column" wrap="nowrap">
                <Grid item>
                    <Typography variant="h1">{device?.alias}</Typography>
                    <Typography variant="subtitle2" style={{ opacity: 0.6 }}>{device?.identifier}</Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <Grid item>
                            <Card>
                                <CardHeader title="States" action={
                                    <IconButton onClick={handleRefresh}>
                                        <RefreshSharpIcon />
                                    </IconButton>
                                } />
                                <CardContent style={{ padding: 0 }}>
                                    <AutoTable error={error} isLoading={isLoading} items={stateTableItems} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

DeviceDetails.layout = AppLayout;

export default observer(DeviceDetails);