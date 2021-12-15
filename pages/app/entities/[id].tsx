import { Accordion, Box, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, Paper, Skeleton, Slide, Slider, Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import { IDeviceContact, IDeviceContactState } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { observer } from 'mobx-react-lite';
import { Clear as ClearIcon, ExpandMore as ExpandMoreIcon, PlayArrow as PlayArrowIcon, Send as SendIcon, Share as ShareIcon } from '@mui/icons-material';
import HttpService from '../../../src/services/HttpService';
import ConductsService from '../../../src/conducts/ConductsService';
import ResultsPlaceholder from '../../../components/shared/indicators/ResultsPlaceholder';
import CopyToClipboardInput from '../../../components/shared/form/CopyToClipboardInput';
import throttle from '../../../src/helpers/Throttle';
import { useCallback } from 'react';
import blendColors from '../../../src/helpers/BlendColors';
import SelectItems from '../../../components/shared/form/SelectItems';
import { IHistoricalValue } from '../../../components/widgets/parts/WidgetPartGraph';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import useDevice from '../../../src/hooks/useDevice';
import useHashParam from '../../../src/hooks/useHashParam';
import EditableInput from '../../../components/shared/form/EditableInput';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>{children}</Box>
            )}
        </div>
    );
}

interface IStateTableItem extends IAutoTableItem {
    name: string,
    value?: string,
    lastUpdate?: string | JSX.Element,
    _contactName: string,
    _channelName: string
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
    const [dataValuesSelected, setDataValueSelected] = useState<string[]>(props.contact.dataValues && props.contact.dataValues.length ? [props.state?.valueSerialized ?? props.contact.dataValues[0].value] : []);
    const requestDoubleChangeMemoized = useCallback(throttle(async (value) => {
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
        console.log('double changed', value)
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
        if ((props.contact.dataType === 'colortemp' || props.contact.dataType === 'double') &&
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
                <IconButton onClick={handleActionClick} size="large"><PlayArrowIcon /></IconButton>
            </Stack>
        );
    } else if (props.contact.dataType === 'double') {
        const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
            marks={[
                { label: "Low", value: 0 },
                { label: "High", value: 1 }
            ]}
            onChange={handleDoubleChange}
            onChangeCommitted={handleDoubleChange} />
    } else if (props.contact.dataType === 'colortemp') {
        const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
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

function historicalValueToTableItem(value: IHistoricalValue): IAutoTableItem {
    return {
        id: value.timeStamp.toString(),
        time: <ReactTimeago date={value.timeStamp} />,
        value: value.valueSerialized,
    };
}

const DeviceContactHistory = (props: { deviceId: string }) => {
    const [contactName] = useHashParam('contact');
    const [channelName] = useHashParam('channel');
    const loadContactHistory = useCallback(
        async () => {
            if (channelName && contactName) {
                return await DevicesRepository.getDeviceStateHistoryAsync({
                    deviceId: props.deviceId,
                    channelName: channelName,
                    contactName: contactName
                }) || [];
            } else return [];
        },
        [props.deviceId, channelName, contactName]);

    const stateItemsTable = useAutoTable(loadContactHistory, historicalValueToTableItem);

    const [selectedTab, setSelectedTab] = useState(0);
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
        };
    }

    return (
        <Card>
            <CardHeader title="State" />
            <CardMedia>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Table" {...a11yProps(0)} />
                    <Tab label="Graph" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    <AutoTable {...stateItemsTable} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <div>Graph</div>
                </TabPanel>
            </CardMedia>
        </Card>
    );
};

const DeviceDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const device = useDevice(typeof id !== "object" && typeof id !== 'undefined' ? id : undefined);
    const [stateTableItems, setStateTableItems] = useState<IStateTableItem[] | undefined>();
    const [actionTableItems, setActionTableItems] = useState<IActionTableItem[] | undefined>();

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
                            _channelName: endpoint.channel,
                            _contactName: contact.name,
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
        } catch (err: any) {
            setError(err?.toString());
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
            type: 1, // 1 - Device
            entityId: device?.id,
            userEmails: [shareWithNewEmail]
        });

        device?.sharedWith.push({ id: '', email: shareWithNewEmail });
        setIsShareWithNewOpen(false);
    };

    const handleCancelShareWithNew = () => {
        setShareWithNewEmail('');
        setIsShareWithNewOpen(false);
    };

    const handleDelete = async () => {
        if (device) {
            await DevicesRepository.deleteAsync(device.id)
            router.push('/app/entities');
        }
    };

    const EntityInformation = () => (
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
                                {device && device?.getLastActivity() > 0 ? <ReactTimeago date={device?.getLastActivity()} /> : "Never"}
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
                            <Grid item>
                                {device && (
                                    <ConfirmDeleteButton
                                        buttonLabel="Delete..."
                                        title="Delete"
                                        expectedConfirmText={device.alias}
                                        onConfirm={handleDelete} />
                                )}
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );

    const EntityActions = () => (
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
    );

    const EntityStates = () => {
        const [_1, setContactNameHash] = useHashParam('contact');
        const [_2, setChannelNameHash] = useHashParam('channel');
        const handleStateSelected = async (row: IStateTableItem) => {
            await setChannelNameHash(row._channelName);
            await setContactNameHash(row._contactName);
        };

        return (
            <Card>
                <CardHeader title="States" />
                <CardContent style={{ padding: 0 }}>
                    <AutoTable error={error} isLoading={isLoading} items={stateTableItems} onRowClick={handleStateSelected} />
                </CardContent>
            </Card>
        );
    };

    const EntityShare = () => (
        <Card>
            <CardHeader
                title={`Shared with (${device?.sharedWith?.length || 1})`}
                action={(
                    <IconButton onClick={handleShareWithUser} size="large">
                        <ShareIcon />
                    </IconButton>
                )} />
            <CardContent style={{ padding: 0 }}>
                <Slide in={isShareWithNewOpen} direction="down" mountOnEnter unmountOnExit>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1, px: 2 }}>
                        <TextField label="Email address" type="email" fullWidth onChange={(e) => setShareWithNewEmail(e.target.value)} />
                        <Stack direction="row">
                            <IconButton onClick={handleSubmitShareWithNew} size="large" title="Send invitation"><SendIcon /></IconButton>
                            <IconButton onClick={handleCancelShareWithNew} size="large" title="Cancel"><ClearIcon /></IconButton>
                        </Stack>
                    </Stack>
                </Slide>
                <AutoTable error={""} isLoading={isLoading} items={device?.sharedWith.map(u => ({ id: u.id, name: u.fullName ?? u.email, email: u.email }))} />
            </CardContent>
        </Card>
    );

    const handleRename = async (newAlias: string) => {
        if (device) {
            await DevicesRepository.renameAsync(device.id, newAlias);
        }
    }

    return (
        <Stack spacing={{ mobile: 1, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
            <Stack>
                <EditableInput
                    sx={{
                        fontWeight: 300,
                        fontSize: { mobile: 18, tablet: 24 }
                    }}
                    text={device?.alias || ''}
                    noWrap
                    onChange={handleRename} />
            </Stack>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <EntityInformation />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <EntityActions />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <EntityStates />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <EntityShare />
                    </Grid>
                    {device && (
                        <Grid item>
                            <DeviceContactHistory deviceId={device.id} />
                        </Grid>
                    )}
                </Grid>
            </div>
        </Stack>
    );
}

DeviceDetails.layout = AppLayoutWithAuth;

export default observer(DeviceDetails);
