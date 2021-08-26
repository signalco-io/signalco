import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Grid, IconButton, Paper, Skeleton, Slide, Slider, Stack, Switch, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import { IDeviceContact, IDeviceContactState, IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { observer } from 'mobx-react-lite';
import { Clear as ClearIcon, ExpandMore as ExpandMoreIcon, PlayArrow as PlayArrowIcon, Send as SendIcon, Share as ShareIcon } from '@material-ui/icons';
import HttpService from '../../../src/services/HttpService';
import ConductsService from '../../../src/conducts/ConductsService';
import ResultsPlaceholder from '../../../components/shared/indicators/ResultsPlaceholder';
import CopyToClipboardInput from '../../../components/shared/form/CopyToClipboardInput';
import throttle from '../../../src/helpers/Throttle';
import { useCallback } from 'react';
import blendColors from '../../../src/helpers/BlendColors';
import SelectItems from '../../../components/shared/form/SelectItems';

interface IStateTableItem extends IAutoTableItem {
    name: string,
    value?: string,
    lastUpdate?: string | JSX.Element
}

interface IActionTableItem {
    name: string,
    contact: IDeviceContact,
    state?: IDeviceContactState,
    channel: string
}

const DeviceContactAction = observer((props: { deviceId: string, state?: IDeviceContactState, contact: IDeviceContact, channel: string }) => {
    const [sliderValue, setSliderValue] = useState<number | number[] | undefined>();
    const [sliderColor, setSliderColor] = useState<string | undefined>();
    const [dataValuesSelected, setDataValueSelected] = useState<string[]>(props.contact.dataValues ? [props.state?.valueSerialized ?? props.contact.dataValues[0].value] : []);
    const requestDoubleChangeMemoized = useCallback(throttle(async (value: number | number[]) => {
        console.log('Do double change', 'contact:', props.contact, 'state:', props.state, 'value:', value);

        await ConductsService.RequestConductAsync({
            channelName: props.channel,
            contactName: props.contact.name,
            deviceId: props.deviceId
        }, value);
    }, 500), []);

    const handleBooleanClick = async () => {
        const newState = props.state?.valueSerialized === 'true' ? false : true;

        console.log("Do boolean", 'contact:', props.contact, 'state:', props.state, 'new state:', newState);

        await ConductsService.RequestConductAsync({
            channelName: props.channel,
            contactName: props.contact.name,
            deviceId: props.deviceId
        }, newState);
    };

    const handleActionClick = async () => {
        console.log("Do action", 'contact:', props.contact, 'state:', props.state, 'dataValuesSelected:', dataValuesSelected);

        await ConductsService.RequestConductAsync({
            channelName: props.channel,
            contactName: props.contact.name,
            deviceId: props.deviceId
        }, props.contact.dataValuesMultiple ? dataValuesSelected : dataValuesSelected[0]);
    };

    const handleDoubleChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
        setSliderValue(value);
        requestDoubleChangeMemoized(value);
    };

    const handleColorTemperatureChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
        setSliderValue(value);
        requestDoubleChangeMemoized(value);
    };

    const handleDataValuesChanged = (values: string[]) => {
        console.log('selected', values)
        setDataValueSelected(values);
    }

    useEffect(() => {
        if ((props.contact.dataType === 'colortemp' ||
            props.contact.dataType === 'double') &&
            typeof sliderValue === 'number') {
            if (props.contact.dataType === 'colortemp') {
                setSliderColor(blendColors('#ffffff', '#C47A10', sliderValue));
            }
            if (Math.abs(props.state?.valueSerialized - sliderValue) < 0.01) {
                setSliderValue(undefined);
            }
        }
    }, [props.state?.valueSerialized, props.contact.dataType, sliderValue]);

    if (props.contact.dataType === 'bool') {
        return <Switch onChange={handleBooleanClick} checked={props.state?.valueSerialized === "true"} color="warning" />
    } else if (props.contact.dataType === 'action' || props.contact.dataType === 'enum') {
        return (
            <Stack alignItems="center" direction="row">
                {props.contact.dataValues && <SelectItems value={dataValuesSelected} items={props.contact.dataValues} multiple={props.contact.dataValuesMultiple} onChange={handleDataValuesChanged} />}
                <IconButton onClick={handleActionClick}><PlayArrowIcon /></IconButton>
            </Stack>)
    } else if (props.contact.dataType === 'double') {
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={sliderValue ?? props.state?.valueSerialized}
            marks={[
                { label: "Low", value: 0 },
                { label: "High", value: 1 }
            ]}
            onChange={handleDoubleChange}
            onChangeCommitted={handleDoubleChange} />
    } else if (props.contact.dataType === 'colortemp') {
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={sliderValue ?? props.state?.valueSerialized}
            marks={[
                { label: "Cold", value: 0 },
                { label: "Warm", value: 1 }
            ]}
            onChange={handleColorTemperatureChange}
            onChangeCommitted={handleColorTemperatureChange} />
    } else {
        return <Typography color="textSecondary" variant="caption">Action for this contact not supported yet.</Typography>
    }
});

const ContactStateLastUpdatedDisplay = observer((props: { state?: IDeviceContactState }) => (
    <>
        {props.state ? <ReactTimeago date={props.state.timeStamp} live /> : "Unknown"}
    </>
));

const ContactStateValueDisplay = observer((props: { state?: IDeviceContactState }) => (
    <>
        {props.state?.valueSerialized}
    </>
));

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
            } catch (err: any) {
                setError(err?.toString());
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
                            value: <ContactStateValueDisplay state={state} />,
                            lastUpdate: <ContactStateLastUpdatedDisplay state={state} />
                        };
                    }));

                    // Process action items
                    Array.prototype.push.apply(actionItems, endpoint.contacts.filter(contact => contact.access & 0x2).map(contact => {
                        const state = device?.states.find(state => state.channel === endpoint.channel && state.name === contact.name);

                        return {
                            id: `${endpoint.channel}-${contact.name}`,
                            name: contact.name,
                            contact: contact,
                            state: state,
                            channel: endpoint.channel
                        } as IActionTableItem;
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
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardHeader title="Information" />
                                <CardContent>
                                    <Accordion elevation={3} defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>General</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={1} >
                                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                                    <span>Last activity</span>
                                                    {device ? <ReactTimeago date={device?.getLastActivity()} /> : "Unknown"}
                                                </Stack>
                                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                                    <span>Model</span>
                                                    <Typography>{device?.model}</Typography>
                                                </Stack>
                                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                                    <span>Manufacturer</span>
                                                    <Typography>{device?.manufacturer}</Typography>
                                                </Stack>
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion elevation={3}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Advanced</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={3}>
                                                    <span>ID</span>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <CopyToClipboardInput readOnly fullWidth size="small" value={device?.id ?? ''} />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <span>Identifier</span>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <CopyToClipboardInput readOnly fullWidth size="small" value={device?.identifier ?? ''} />
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardHeader title="Actions" />
                                <CardContent>
                                    <Stack spacing={1}>
                                        {typeof actionTableItems === 'undefined' && (
                                            <Skeleton width="100%" height={90} />
                                        )}
                                        {typeof actionTableItems !== 'undefined' && actionTableItems?.length <= 0 && (
                                            <ResultsPlaceholder />
                                        )}
                                        {actionTableItems?.map(item => (
                                            <Paper elevation={0} key={`action-item-${item.name}`} sx={{ p: 2 }}>
                                                <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2} wrap="nowrap">
                                                    <Grid item>
                                                        <Typography>{item.name}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        {device && <DeviceContactAction deviceId={device.id} channel={item.channel} contact={item.contact} state={item.state} />}
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardHeader title="States" />
                                <CardContent style={{ padding: 0 }}>
                                    <AutoTable error={error} isLoading={isLoading} items={stateTableItems} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
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
        </Box >
    );
}

DeviceDetails.layout = AppLayout;

export default observer(DeviceDetails);
