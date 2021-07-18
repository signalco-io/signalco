import { Box, Card, CardContent, CardHeader, Grid, IconButton, Slide, Stack, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import AutoTable from '../../../components/shared/table/AutoTable';
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { observer } from 'mobx-react-lite';
import { Clear as ClearIcon, Send as SendIcon, Share as ShareIcon } from '@material-ui/icons';
import HttpService from '../../../src/services/HttpService';

const DeviceDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [device, setDevice] = useState<IDeviceModel | undefined>();

    useEffect(() => {
        const loadDeviceAsync = async () => {
            try {
                if (typeof id !== "object" &&
                    typeof id !== 'undefined') {
                    const loadedDevice = await DevicesRepository.getDeviceAsync(id);
                    setDevice(loadedDevice);
                }
            } catch (err) {
                setError(err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        loadDeviceAsync();
    }, [id]);

    const [isShareWithNewOpen, setIsShareWithNewOpen] = useState(false);
    const [shareWithNewEmail, setShareWithNewEmail] = useState('');
    const handleShareWithUser = () => {
        setIsShareWithNewOpen(true);
    };

    const handleSubmitShareWithNew = async () => {
        // TODO: Add success/error indicator
        await HttpService.requestAsync("/share/entity", "post", {
            type: 0, // 0 - Device
            entityId: device?.id,
            userEmails: [shareWithNewEmail]
        });
    };

    const handleCancelShareWithNew = () => {
        setShareWithNewEmail('');
        setIsShareWithNewOpen(false);
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardHeader title="Information" />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><span>Model</span></Grid>
                                        <Grid item xs={6}><Typography>{device?.model}</Typography></Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><span>Manufacturer</span></Grid>
                                        <Grid item xs={6}><Typography>{device?.manufacturer}</Typography></Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardHeader title="States" />
                                <CardContent style={{ padding: 0 }}>
                                    <AutoTable error={error} isLoading={isLoading} items={stateTableItems} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardHeader
                                    title={`Shared with (${device?.sharedWith?.length || 1})`}
                                    action={(
                                        <IconButton onClick={handleShareWithUser}>
                                            <ShareIcon />
                                        </IconButton>
                                    )} />
                                <CardContent style={{ padding: 0 }}>
                                    <Slide in={isShareWithNewOpen} direction="down" mountOnEnter unmountOnExit>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1, px: 2 }}>
                                            <TextField label="Email address" type="email" variant="outlined" fullWidth onChange={(e) => setShareWithNewEmail(e.target.value)} />
                                            <Stack direction="row">
                                                <IconButton onClick={handleSubmitShareWithNew} size="large" title="Send invitation"><SendIcon /></IconButton>
                                                <IconButton onClick={handleCancelShareWithNew} size="large" title="Cancel"><ClearIcon /></IconButton>
                                            </Stack>
                                        </Stack>
                                    </Slide>
                                    <AutoTable error={""} isLoading={isLoading} items={device?.sharedWith.map(u => ({ id: u.id, name: u.fullName ?? u.email, email: u.email }))} />
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