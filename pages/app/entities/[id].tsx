import { Box, Card, CardHeader, Stack, CardMedia, Button, Menu, MenuItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import useEntity from '../../../src/hooks/useEntity';
import EditableInput from '../../../components/shared/form/EditableInput';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import useLocale from '../../../src/hooks/useLocale';
import { entityDeleteAsync, entityRenameAsync } from 'src/entity/EntityRepository';
import AutoTable, { IAutoTableItem } from 'components/shared/table/AutoTable';
import Timeago from 'components/shared/time/Timeago';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import PageNotificationService from 'src/notifications/PageNotificationService';
import ConfirmDeleteDialog from 'components/shared/dialog/ConfirmDeleteDialog';
import EntityStatus from 'components/entity/EntityStatus';

// const DynamicGraph = dynamic(() => import('../../../components/graphs/Graph'));

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
//}

// function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`tabpanel-${index}`}
//             aria-labelledby={`tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box>{children}</Box>
//             )}
//         </div>
//     );
// }

// interface IStateTableItem extends IAutoTableItem {
//     name: string,
//     value?: string,
//     lastUpdate?: string | JSX.Element,
//     _contactName: string,
//     _channelName: string
// }

// interface IActionTableItem {
//     name: string,
//     contact: IDeviceContact,
//     state?: IDeviceContactState,
//     channel: string
// }

// const DeviceContactAction = observer((props: { deviceId: string, state?: IDeviceContactState, contact: IDeviceContact, channel: string }) => {
//     const [sliderValue, setSliderValue] = useState<number | number[] | undefined>();
//     const [sliderColor, setSliderColor] = useState<string | undefined>();
//     const [dataValuesSelected, setDataValueSelected] = useState<string[]>(props.contact.dataValues && props.contact.dataValues.length ? [props.state?.valueSerialized ?? props.contact.dataValues[0].value] : []);
//     const requestDoubleChangeMemoized = useCallback(throttle(async (value) => {
//         console.log('Do double change', 'contact:', props.contact, 'state:', props.state, 'value:', value);
//         await ConductsService.RequestConductAsync({
//             channelName: props.channel,
//             contactName: props.contact.name,
//             deviceId: props.deviceId
//         }, value);
//     }, 500), []);

//     const handleBooleanClick = async () => {
//         const newState = props.state?.valueSerialized === 'true' ? false : true;

//         console.log('Do boolean', 'contact:', props.contact, 'state:', props.state, 'new state:', newState);

//         await ConductsService.RequestConductAsync({
//             channelName: props.channel,
//             contactName: props.contact.name,
//             deviceId: props.deviceId
//         }, newState);
//     };

//     const handleActionClick = async () => {
//         console.log('Do action', 'contact:', props.contact, 'state:', props.state, 'dataValuesSelected:', dataValuesSelected);

//         await ConductsService.RequestConductAsync({
//             channelName: props.channel,
//             contactName: props.contact.name,
//             deviceId: props.deviceId
//         }, props.contact.dataValuesMultiple ? dataValuesSelected : dataValuesSelected[0]);
//     };

//     const handleDoubleChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
//         console.log('double changed', value)
//         setSliderValue(value);
//         requestDoubleChangeMemoized(value);
//     };

//     const handleColorTemperatureChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
//         setSliderValue(value);
//         requestDoubleChangeMemoized(value);
//     };

//     const handleDataValuesChanged = (values: string[]) => {
//         console.log('selected', values)
//         setDataValueSelected(values);
//     }

//     useEffect(() => {
//         if ((props.contact.dataType === 'colortemp' || props.contact.dataType === 'double') &&
//             typeof sliderValue === 'number') {
//             if (props.contact.dataType === 'colortemp') {
//                 setSliderColor(blendColors('#ffffff', '#C47A10', sliderValue));
//             }
//             if (Math.abs(props.state?.valueSerialized - sliderValue) < 0.01) {
//                 setSliderValue(undefined);
//             }
//         }
//     }, [props.state?.valueSerialized, props.contact.dataType, sliderValue]);

//     if (props.contact.dataType === 'bool') {
//         return <Switch onChange={handleBooleanClick} checked={props.state?.valueSerialized === 'true'} color="warning" />
//     } else if (props.contact.dataType === 'action' || props.contact.dataType === 'enum') {
//         return (
//             <Stack alignItems="center" direction="row">
//                 {props.contact.dataValues &&
//                     <SelectItems
//                         label={props.contact.name}
//                         value={dataValuesSelected}
//                         items={props.contact.dataValues}
//                         multiple={props.contact.dataValuesMultiple}
//                         onChange={handleDataValuesChanged} />}
//                 <IconButton onClick={handleActionClick} size="large"><PlayArrowIcon /></IconButton>
//             </Stack>
//         );
//     } else if (props.contact.dataType === 'double') {
//         const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
//         return <Slider
//             step={0.01}
//             sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
//             marks={[
//                 { label: 'Low', value: 0 },
//                 { label: 'High', value: 1 }
//             ]}
//             onChange={handleDoubleChange}
//             onChangeCommitted={handleDoubleChange} />
//     } else if (props.contact.dataType === 'colortemp') {
//         const resolvedSliderValue = sliderValue ?? (Number.parseFloat(props.state?.valueSerialized) || undefined);
//         return <Slider
//             step={0.01}
//             sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
//             marks={[
//                 { label: 'Cold', value: 0 },
//                 { label: 'Warm', value: 1 }
//             ]}
//             onChange={handleColorTemperatureChange}
//             onChangeCommitted={handleColorTemperatureChange} />
//     } else {
//         return <Typography color="textSecondary" variant="caption">Action for this contact not supported yet.</Typography>
//     }
// });

// const ContactStateValueDisplay = observer((props: { contact?: IDeviceContact, state?: IDeviceContactState }) => {
//     const { contact, state } = props;

//     let value = state?.valueSerialized;
//     if (contact?.dataType === 'double' ||
//         contact?.dataType === 'colortemp')
//         value = (parseFloat(value) || 0).toFixed(2);

//     return (
//         <span title={state?.valueSerialized}>
//             {value}
//         </span>
//     );
// });

// function historicalValueToTableItem(value: IHistoricalValue) {
//     return {
//         id: value.timeStamp.toString(),
//         time: <Timeago date={value.timeStamp} />,
//         value: value.valueSerialized,
//     };
// }

// const ContactHistory = (props: { entityId: string }) => {
//     const { t } = useLocale('App', 'Entities')
//     const [contactName, setContactName] = useHashParam('contact');
//     const [channelName, setChannelName] = useHashParam('channel');
//     const [period, setPeriod] = useState('1.00:00:00');
//     const loadContactHistory = useCallback(
//         async () => {
//             if (channelName && contactName) {
//                 return await ContactRepository.historyAsync({
//                     entityId: props.entityId,
//                     channelName: channelName,
//                     contactName: contactName
//                 }, period) || [];
//             } else return [];
//         },
//         [props.entityId, channelName, contactName, period]);

//     const stateItemsTable = useAutoTable(loadContactHistory, historicalValueToTableItem, t);

//     const [selectedTab, setSelectedTab] = useState(0);
//     const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
//         setSelectedTab(newValue);
//     };

//     function a11yProps(index: number) {
//         return {
//             id: `tab-${index}`,
//             'aria-controls': `tabpanel-${index}`,
//         };
//     }

//     const handlePeriod = (e: SelectChangeEvent<string>) => {
//         setPeriod(e.target.value);
//     }

//     return (
//         <Stack spacing={2}>
//             <Box px={2}>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center">
//                     <Typography variant="h3">{contactName} {t('history')}</Typography>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                         <FormControl variant="filled" hiddenLabel>
//                             <Select labelId="history-period-select" label="Period" onChange={handlePeriod} value={period} size="small">
//                                 <MenuItem value={'01:00:00'}>Last hour</MenuItem>
//                                 <MenuItem value={'12:00:00'}>Last 12 hours</MenuItem>
//                                 <MenuItem value={'1.00:00:00'}>1 day</MenuItem>
//                                 <MenuItem value={'3.00:00:00'}>3 days</MenuItem>
//                                 <MenuItem value={'7.00:00:00'}>7 days</MenuItem>
//                                 <MenuItem value={'31.00:00:00'}>1 month</MenuItem>
//                             </Select>
//                         </FormControl>
//                         <IconButton onClick={() => { setContactName(undefined); setChannelName(undefined); }}><CloseIcon /></IconButton>
//                     </Stack>
//                 </Stack>
//             </Box>
//             <Tabs value={selectedTab} onChange={handleTabChange}>
//                 <Tab label={t('Table')} {...a11yProps(0)} />
//                 <Tab label={t('Graph')} {...a11yProps(1)} />
//             </Tabs>
//             <TabPanel value={selectedTab} index={0}>
//                 <AutoTable {...stateItemsTable} />
//             </TabPanel>
//             <TabPanel value={selectedTab} index={1}>
//                 <DynamicGraph data={stateItemsTable.items} label={contactName} height={200} width={400} durationMs={1 * 24 * 60 * 60 * 1000} />
//             </TabPanel>
//         </Stack>
//     );
// };

function EntityOptions(props: { id: string | undefined }) {
    const { id } = props;
    const { t } = useLocale('App', 'Entities');
    const router = useRouter();
    const popupState = usePopupState({ variant: 'popover', popupId: 'entityOptionsMenu' });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: entity } = useEntity(id);

    const handleDelete = () => {
        popupState.close();
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (typeof id === 'undefined')
                throw new Error('Entity identifier not present.');

            await entityDeleteAsync(id);
            router.push('/app/entities');
        } catch (err) {
            PageNotificationService.show(t('DeleteErrorUnknown'))
        }
    };

    return (
        <>
            <Button {...bindTrigger(popupState)}>
                <MoreHorizIcon />
            </Button>
            <Menu  {...bindMenu(popupState)}>
                <MenuItem onClick={handleDelete}>
                    <ListItemText>{t('DeleteButtonLabel')}</ListItemText>
                </MenuItem>
            </Menu>
            <ConfirmDeleteDialog
                expectedConfirmText={entity?.alias || t('ConfirmDialogExpectedText')}
                title={t('DeleteTitle')}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm} />
        </>
    )
}

function DeviceDetails() {
    const router = useRouter();
    const { id: queryId } = router.query;
    const id = typeof queryId !== 'object' && typeof queryId !== 'undefined' ? queryId : undefined;
    const { t } = useLocale('App', 'Entities');
    const { data: entity } = useEntity(id);
    // const [stateTableItems, setStateTableItems] = useState<IStateTableItem[] | undefined>();
    // const [actionTableItems, setActionTableItems] = useState<IActionTableItem[] | undefined>();

    // useEffect(() => {
    //     try {
    //         if (device?.endpoints) {
    //             const stateItems: IStateTableItem[] = [];
    //             const actionItems: IActionTableItem[] = [];
    //             for (const endpoint of device.endpoints) {
    //                 // Process state items
    //                 Array.prototype.push.apply(stateItems, endpoint.contacts.filter(contact => contact.access & 0x5).map(contact => {
    //                     const state = device?.states.find(state => state.channel === endpoint.channel && state.name === contact.name);

    //                     return {
    //                         id: `${endpoint.channel}-${contact.name}`,
    //                         _channelName: endpoint.channel,
    //                         _contactName: contact.name,
    //                         name: contact.name,
    //                         value: <ContactStateValueDisplay contact={contact} state={state} />,
    //                         lastUpdate: <ContactStateLastUpdatedDisplay state={state} />
    //                     };
    //                 }));

    //                 // Process action items
    //                 Array.prototype.push.apply(actionItems, endpoint.contacts.filter(contact => contact.access & 0x2).map(contact => {
    //                     const state = device?.states.find(state => state.channel === endpoint.channel && state.name === contact.name);

    //                     return {
    //                         id: `${endpoint.channel}-${contact.name}`,
    //                         name: contact.name,
    //                         contact: contact,
    //                         state: state,
    //                         channel: endpoint.channel
    //                     } as IActionTableItem;
    //                 }));
    //             }
    //             setStateTableItems(stateItems);
    //             setActionTableItems(actionItems);
    //         }
    //     } catch (err: any) {
    //         setError(err?.toString());
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [device]);

    // const EntityActions = () => (
    //     <Card>
    //         <CardHeader title={t('Actions')} />
    //         <CardContent>
    //             <Stack spacing={1}>
    //                 {typeof actionTableItems === 'undefined' && (
    //                     <Skeleton width="100%" height={90} />
    //                 )}
    //                 {typeof actionTableItems !== 'undefined' && actionTableItems?.length <= 0 && (
    //                     <ResultsPlaceholder />
    //                 )}
    //                 {actionTableItems?.map(item => (
    //                     <Paper elevation={0} key={`action-item-${item.name}`} sx={{ p: 2 }}>
    //                         <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2} wrap="nowrap">
    //                             <Grid item>
    //                                 <Typography>{item.name}</Typography>
    //                             </Grid>
    //                             {/* <Grid item>
    //                                 {id && <DeviceContactAction deviceId={id} channel={item.channel} contact={item.contact} state={item.state} />}
    //                             </Grid> */}
    //                         </Grid>
    //                     </Paper>
    //                 ))}
    //             </Stack>
    //         </CardContent>
    //     </Card>
    // );

    function ContactsTable() {
        const contacts = entity?.contacts;
        const tableItems = contacts?.map(c => ({
            id: c.contactName,
            name: c.contactName,
            channel: c.channelName,
            value: c.valueSerialized,
            lastActivity: <Timeago date={c.timeStamp} live />
        }));
        const isLoading = false;
        const error = undefined;
        // const [contactNameHash, setContactNameHash] = useHashParam('contactName');
        // const [channelNameHash, setChannelNameHash] = useHashParam('channelName');
        const handleStateSelected = async (_: IAutoTableItem) => {
            // await setChannelNameHash(row._channelName);
            // await setContactNameHash(row._contactName);
        };

        return (
            <Card>
                <CardHeader title={t('States')} />
                <CardMedia>
                    <Stack spacing={4}>
                        <AutoTable error={error} isLoading={isLoading} items={tableItems} onRowClick={handleStateSelected} localize={t} />
                        {/* {id && contactNameHash && channelNameHash && (
                            <ContactHistory entityId={id} />
                        )} */}
                    </Stack>
                </CardMedia>
            </Card>
        );
    }

    const handleRename = async (newAlias: string) => {
        if (id) {
            await entityRenameAsync(id, newAlias);
        }
    }

    return (
        <Stack spacing={{ xs: 1, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Stack sx={{ px: 2 }} spacing={1}>
                <Stack direction="row" spacing={1}>
                    <EditableInput
                        sx={{
                            fontWeight: 300,
                            fontSize: { xs: 18, sm: 24 }
                        }}
                        text={entity?.alias || ''}
                        noWrap
                        onChange={handleRename} />
                    <EntityOptions id={id} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <EntityStatus entity={entity} />
                    <ShareEntityChip entity={entity} entityType={1} />
                </Stack>
            </Stack>
            <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <ContactsTable />
            </Box>
        </Stack>
    );
}

DeviceDetails.layout = AppLayoutWithAuth;

export default DeviceDetails;
