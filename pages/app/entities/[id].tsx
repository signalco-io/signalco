import { Accordion, Box, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Grid, IconButton, Paper, Skeleton, Slider, Stack, Switch, Tab, Tabs, Typography, CardMedia, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import { IDeviceContact, IDeviceContactState } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { observer } from 'mobx-react-lite';
import { ExpandMore as ExpandMoreIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import ConductsService from '../../../src/conducts/ConductsService';
import ResultsPlaceholder from '../../../components/shared/indicators/ResultsPlaceholder';
import CopyToClipboardInput from '../../../components/shared/form/CopyToClipboardInput';
import throttle from '../../../src/helpers/Throttle';
import { useCallback } from 'react';
import blendColors from '../../../src/helpers/BlendColors';
import SelectItems from '../../../components/shared/form/SelectItems';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import useDevice from '../../../src/hooks/useDevice';
import useHashParam from '../../../src/hooks/useHashParam';
import EditableInput from '../../../components/shared/form/EditableInput';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import { IHistoricalValue } from '../../../src/entity/IHistoricalValue';
import dynamic from 'next/dynamic';
import CloseIcon from '@mui/icons-material/Close';
import useLocale from '../../../src/hooks/useLocale';
import Timeago from '../../../components/shared/time/Timeago';

const DynamicGraph = dynamic(() => import('../../../components/graphs/Graph'));

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

        console.log('Do boolean', 'contact:', props.contact, 'state:', props.state, 'new state:', newState);

        await ConductsService.RequestConductAsync({
            channelName: props.channel,
            contactName: props.contact.name,
            deviceId: props.deviceId
        }, newState);
    };

    const handleActionClick = async () => {
        console.log('Do action', 'contact:', props.contact, 'state:', props.state, 'dataValuesSelected:', dataValuesSelected);

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
        return <Switch onChange={handleBooleanClick} checked={props.state?.valueSerialized === 'true'} color="warning" />
    } else if (props.contact.dataType === 'action' || props.contact.dataType === 'enum') {
        return (
            <Stack alignItems="center" direction="row">
                {props.contact.dataValues &&
                    <SelectItems
                        label={props.contact.name}
                        value={dataValuesSelected}
                        items={props.contact.dataValues}
                        multiple={props.contact.dataValuesMultiple}
                        onChange={handleDataValuesChanged} />}
                <IconButton onClick={handleActionClick} size="large"><PlayArrowIcon /></IconButton>
            </Stack>
        );
    } else if (props.contact.dataType === 'double') {
        const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
            marks={[
                { label: 'Low', value: 0 },
                { label: 'High', value: 1 }
            ]}
            onChange={handleDoubleChange}
            onChangeCommitted={handleDoubleChange} />
    } else if (props.contact.dataType === 'colortemp') {
        const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
            marks={[
                { label: 'Cold', value: 0 },
                { label: 'Warm', value: 1 }
            ]}
            onChange={handleColorTemperatureChange}
            onChangeCommitted={handleColorTemperatureChange} />
    } else {
        return <Typography color="textSecondary" variant="caption">Action for this contact not supported yet.</Typography>
    }
});

const ContactStateLastUpdatedDisplay = observer((props: { state?: IDeviceContactState }) => (
    <Timeago date={props.state?.timeStamp} live />
));

const ContactStateValueDisplay = observer((props: { contact?: IDeviceContact, state?: IDeviceContactState }) => {
    const { contact, state } = props;

    let value = state?.valueSerialized;
    if (contact?.dataType === 'double' ||
        contact?.dataType === 'colortemp')
        value = (parseFloat(value) || 0).toFixed(2);

    return (
        <span title={state?.valueSerialized}>
            {value}
        </span>
    );
});

function historicalValueToTableItem(value: IHistoricalValue) {
    return {
        id: value.timeStamp.toString(),
        time: <Timeago date={value.timeStamp} />,
        value: value.valueSerialized,
    };
}

const DeviceContactHistory = (props: { deviceId: string }) => {
    const { t } = useLocale('App', 'Entities')
    const [contactName, setContactName] = useHashParam('contact');
    const [channelName, setChannelName] = useHashParam('channel');
    const [period, setPeriod] = useState('1.00:00:00');
    const loadContactHistory = useCallback(
        async () => {
            if (channelName && contactName) {
                return await DevicesRepository.getDeviceStateHistoryAsync({
                    deviceId: props.deviceId,
                    channelName: channelName,
                    contactName: contactName
                }, period) || [];
            } else return [];
        },
        [props.deviceId, channelName, contactName, period]);

    const stateItemsTable = useAutoTable(loadContactHistory, historicalValueToTableItem, t);

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

    const handlePeriod = (e: SelectChangeEvent<string>) => {
        setPeriod(e.target.value);
    }

    return (
        <Stack spacing={2}>
            <Box px={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">{contactName} {t('history')}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <FormControl variant="filled" hiddenLabel>
                            <Select labelId="history-period-select" label="Period" onChange={handlePeriod} value={period} size="small">
                                <MenuItem value={'01:00:00'}>Last hour</MenuItem>
                                <MenuItem value={'12:00:00'}>Last 12 hours</MenuItem>
                                <MenuItem value={'1.00:00:00'}>1 day</MenuItem>
                                <MenuItem value={'3.00:00:00'}>3 days</MenuItem>
                                <MenuItem value={'7.00:00:00'}>7 days</MenuItem>
                                <MenuItem value={'31.00:00:00'}>1 month</MenuItem>
                            </Select>
                        </FormControl>
                        <IconButton onClick={() => { setContactName(undefined); setChannelName(undefined); }}><CloseIcon /></IconButton>
                    </Stack>
                </Stack>
            </Box>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label={t('Table')} {...a11yProps(0)} />
                <Tab label={t('Graph')} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
                <AutoTable {...stateItemsTable} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <DynamicGraph data={stateItemsTable.items} label={contactName} height={200} width={400} durationMs={1 * 24 * 60 * 60 * 1000} />
            </TabPanel>
        </Stack>
    );
};

const DeviceDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useLocale('App', 'Entities');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const device = useDevice(typeof id !== 'object' && typeof id !== 'undefined' ? id : undefined);
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
                            value: <ContactStateValueDisplay contact={contact} state={state} />,
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

    const handleDelete = async () => {
        if (device) {
            await DevicesRepository.deleteAsync(device.id)
            router.push('/app/entities');
        }
    };

    const EntityInformation = () => (
        <Card>
            <CardHeader title={t('Information')} />
            <CardContent>
                <Accordion elevation={3} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{t('General')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={1} >
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <span>{t('LastActivity')}</span>
                                <Timeago date={device?.getLastActivity()} />
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <span>{t('Model')}</span>
                                <Typography>{device?.model}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <span>{t('Manufacturer')}</span>
                                <Typography>{device?.manufacturer}</Typography>
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                <Accordion elevation={3}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{t('Advanced')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                                <span>{t('ID')}</span>
                            </Grid>
                            <Grid item xs={9}>
                                <CopyToClipboardInput id="device-id" readOnly fullWidth size="small" value={device?.id ?? ''} />
                            </Grid>
                            <Grid item xs={3}>
                                <span>{t('Identifier')}</span>
                            </Grid>
                            <Grid item xs={9}>
                                <CopyToClipboardInput id="device-identifier" readOnly fullWidth size="small" value={device?.identifier ?? ''} />
                            </Grid>
                            <Grid item>
                                {device && (
                                    <ConfirmDeleteButton
                                        buttonLabel={t('DeleteButtonLabel')}
                                        title={t('DeleteTitle')}
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
            <CardHeader title={t('Actions')} />
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
        const [contactNameHash, setContactNameHash] = useHashParam('contact');
        const [channelNameHash, setChannelNameHash] = useHashParam('channel');
        const handleStateSelected = async (row: IStateTableItem) => {
            await setChannelNameHash(row._channelName);
            await setContactNameHash(row._contactName);
        };

        return (
            <Card>
                <CardHeader title={t('States')} />
                <CardMedia>
                    <Stack spacing={4}>
                        <AutoTable error={error} isLoading={isLoading} items={stateTableItems} onRowClick={handleStateSelected} localize={t} />
                        {device && contactNameHash && channelNameHash && (
                            <DeviceContactHistory deviceId={device.id} />
                        )}
                    </Stack>
                </CardMedia>
            </Card>
        );
    };

    const handleRename = async (newAlias: string) => {
        if (device) {
            await DevicesRepository.renameAsync(device.id, newAlias);
        }
    }

    return (
        <Stack spacing={{ xs: 1, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Stack sx={{ px: 2 }} spacing={1}>
                <EditableInput
                    sx={{
                        fontWeight: 300,
                        fontSize: { xs: 18, sm: 24 }
                    }}
                    text={device?.alias || ''}
                    noWrap
                    onChange={handleRename} />
                <Stack direction="row">
                    <ShareEntityChip entity={device} entityType={1} />
                </Stack>
            </Stack>
            <Box sx={{ px: { xs: 1, sm: 2 } }}>
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
                </Grid>
            </Box>
        </Stack>
    );
}

DeviceDetails.layout = AppLayoutWithAuth;

export default observer(DeviceDetails);
