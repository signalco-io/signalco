import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Slide, Stack, Switch, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import { IDeviceContact, IDeviceContactState, IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { observer } from 'mobx-react-lite';
import { Clear as ClearIcon, Send as SendIcon, Share as ShareIcon } from '@material-ui/icons';
import HttpService from '../../../src/services/HttpService';
import ConductsService from '../../../src/conducts/ConductsService';

interface IStateTableItem extends IAutoTableItem {
    name: string,
    value?: string,
    lastUpdate?: string | JSX.Element
}

interface IActionTableItem extends IAutoTableItem {
    name: string,
    action: () => Promise<void>
}

const DeviceContactAction = observer((props: { deviceId: string, state?: IDeviceContactState, contact: IDeviceContact, channel: string }) => {
    const handleBooleanClick = async () => {
        console.log("Do action for ", props.contact, props.state);

        await ConductsService.RequestConductAsync({
            channelName: props.channel,
            contactName: props.contact.name,
            deviceId: props.deviceId
        }, props.state?.valueSerialized === 'true' ? false : true);
    };

    const handleActionClick = () => {
        console.log("Do action for ", props.contact, props.state);
    };

    if (props.contact.dataType === 'bool') {
        return <Switch onChange={handleBooleanClick} checked={props.state?.valueSerialized === "true"} color="warning" />
    } else if (props.contact.dataType === 'action') {
        return <Button onClick={handleActionClick}>Do</Button>
    } else {
        return <Typography color="textSecondary" variant="caption">Action for this contact not supported yet.</Typography>
    }
});

const DeviceDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [device, setDevice] = useState<IDeviceModel | undefined>();
    const [stateTableItems, setStateTableItems] = useState<IStateTableItem[] | undefined>();
    const [actionTableItems, setActionTableItems] = useState<IActionTableItem[] | undefined>();

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
            }
        };

        loadDeviceAsync();
    }, [id]);

    useEffect(() => {
        try {
            if (device?.endpoints) {
                const stateItems: IStateTableItem[] = [];
                const actionItems: IActionTableItem[] = [];
                for (const endpoint of device.endpoints) {
                    // Process state items
                    Array.prototype.push.apply(stateItems, endpoint.contacts.filter(contact => contact.access & 0x5).map(contact => {
                        const state = device?.states.find(state => state.channel === endpoint.channel && state.name === contact.name);

                        return {
                            id: `${endpoint.channel}-${contact.name}`,
                            name: contact.name,
                            value: state?.valueSerialized,
                            lastUpdate: state ? <ReactTimeago date={state.timeStamp} live /> : "Unknown"
                        };
                    }));

                    // Process action items
                    Array.prototype.push.apply(actionItems, endpoint.contacts.filter(contact => contact.access & 0x2).map(contact => {
                        const state = device?.states.find(state => state.channel === endpoint.channel && state.name === contact.name);

                        return {
                            id: `${endpoint.channel}-${contact.name}`,
                            name: contact.name,
                            action: <DeviceContactAction deviceId={device.id} channel={endpoint.channel} contact={contact} state={state} />
                        };
                    }));
                }
                setStateTableItems(stateItems);
                setActionTableItems(actionItems);
            }
        } catch (err) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    }, [device]);

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
                                <CardHeader title="Actions" />
                                <CardContent style={{ padding: 0 }}>
                                    <AutoTable error={error} isLoading={isLoading} items={actionTableItems} />
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