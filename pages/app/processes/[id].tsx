import { Alert, Box, ButtonBase, Chip, Collapse, Container, Grid, IconButton, Menu, MenuItem, Paper, Popover, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import { observer } from 'mobx-react-lite';
import ProcessesRepository from '../../../src/processes/ProcessesRepository';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { makeAutoObservable } from 'mobx';
import { IDeviceTargetIncomplete } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import DisplayDeviceTarget from '../../../components/shared/entity/DisplayDeviceTarget';
import useDevice from '../../../src/hooks/useDevice';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';
import EntityRepository from '../../../src/entity/EntityRepository';
import { ObjectDictAny } from '../../../src/sharedTypes';
import { TransitionGroup } from 'react-transition-group';
import useLocale from '../../../src/hooks/useLocale';
import { useLoadAndError } from '../../../src/hooks/useLoadingAndError';

interface IDeviceStateValue {
    value?: any
}

interface IDeviceTargetState {
    target?: IDeviceTargetIncomplete;
    value?: any;
}

const isIDeviceStateValue = (arg: any): arg is IDeviceStateValue => arg?.value !== undefined;
const isIConditionDeviceStateTarget = (arg: any): arg is IConditionDeviceStateTarget => arg?.target !== undefined;
const isIDeviceStateTarget = (arg: any): arg is IDeviceTargetIncomplete => arg?.deviceId !== undefined && typeof arg?.contact !== 'undefined' && typeof arg?.channel !== 'undefined';

interface IDeviceStateTrigger {
    deviceId?: string;
    channelName?: string;
    contactName?: string;
}

class DeviceStateTrigger implements IDeviceStateTrigger {
    deviceId?: string;
    channelName?: string;
    contactName?: string;
}

interface IConditionDeviceStateTarget {
    target: IDeviceTargetIncomplete;
}

interface IConditionValueComparison {
    operation?: string,
    left: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
    valueOperation?: string,
    right: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
}

interface ICondition {
    operation?: string,
    operations: Array<IConditionValueComparison | ICondition>
}

type KeyedObjectOrAny = ObjectDictAny | any;

type ModifierFunc = (key: string, value: any) => Promise<[key: string, value: any]>;

async function mapArrayAsync(obj: KeyedObjectOrAny, funcAsync: ModifierFunc) {
    const newArray = [];
    for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        newArray.push(await mapObjectAsync(element, funcAsync));
    }
    return newArray;
}

async function mapObjectAsync(obj: KeyedObjectOrAny, funcAsync: ModifierFunc): Promise<any> {
    if (typeof obj === 'undefined' || obj == null) return obj;
    if (Array.isArray(obj)) {
        return await mapArrayAsync(obj, funcAsync);
    }
    if (typeof obj !== 'object') return obj;

    const newObj: ObjectDictAny = {};
    const keys = Object.keys(obj);
    for (let ki = 0; ki < keys.length; ki++) {
        const key = keys[ki];
        let [newKey, newValue] = await Promise.resolve(funcAsync(key, obj[key]));
        if (typeof newValue === 'object') {
            newValue = await mapObjectAsync(newValue, funcAsync);
        }
        newObj[newKey] = newValue;
    }
    return newObj;
}

type MapModifier = (key: string, value: any) => Promise<[key: string, value: any] | undefined> | ([key: string, value: any]) | undefined;

const toLowerCaseKeysModifier: MapModifier = (key, value) => [`${key[0].toLowerCase()}${key.substring(1)}`, value];

const deviceToIdentifierModifier: MapModifier = async (key, value) => {
    if (key !== 'deviceId') return;
    const device = await DevicesRepository.getDeviceAsync(value);
    if (!device) return;
    return ['identifier', device.identifier];
};

const contactNameToContactModifier: MapModifier = (key, value) => {
    if (key !== 'contactName') return;
    return ['contact', value];
};

const channelNameToChannelModifier: MapModifier = (key, value) => {
    if (key !== 'channelName') return;
    return ['channel', value];
};

const identifierToDeviceIdModifier: MapModifier = async (key, value) => {
    if (key !== 'identifier') return;
    const device = await DevicesRepository.getDeviceByIdentifierAsync(value);
    if (!device) return;
    return ['deviceId', device.id];
};

const contactToContactNameModifier: MapModifier = (key, value) => {
    if (key !== 'contact') return;
    return ['contactName', value];
};

const channelToChannelNameModifier: MapModifier = (key, value) => {
    if (key !== 'channel') return;
    return ['channelName', value];
};

async function mapWithModifiersAsync(obj: ObjectDictAny, modifiers: MapModifier[]) {
    return await mapObjectAsync(obj, async (key, value) => {
        let newKey = key;
        let newValue = value;
        for (let i = 0; i < modifiers.length; i++) {
            const modifier = modifiers[i];
            const result = await Promise.resolve(modifier(newKey, newValue));
            if (result) {
                [newKey, newValue] = result;
            }
        }
        return [newKey, newValue];
    });
}

class Condition implements ICondition {
    operation?: string | undefined;
    operations: (IConditionValueComparison | ICondition)[] = [];
}

const isIConditionValueComparison = (arg: any): arg is IConditionValueComparison => arg.left !== undefined && arg.right !== undefined;
const isICondition = (arg: any): arg is ICondition => arg.operations !== undefined;

interface IConduct extends IDeviceTargetState {
}

class Conduct implements IConduct {
    target?: IDeviceTargetIncomplete;
    value: any;

    constructor(target?: IDeviceTargetIncomplete, value?: any) {
        this.target = target;
        this.value = value;

        makeAutoObservable(this);
    }
}

async function parseProcessConfigurationAsync(configJson: string | undefined) {
    const config = JSON.parse(configJson ?? '');

    console.log('Parsing config...', config);

    // Migrate to V2
    if (config.Triggers || config.Condition || config.Conducts) {
        config.triggers = config.Triggers;
        config.condition = config.Condition;
        config.conducts = config.Conducts;
    }
    const modifiers = [toLowerCaseKeysModifier, identifierToDeviceIdModifier, contactToContactNameModifier, channelToChannelNameModifier];

    const triggers = await mapWithModifiersAsync(config.triggers, modifiers) as IDeviceStateTrigger[];
    const condition = await mapWithModifiersAsync(config.condition, modifiers) as ICondition;
    const conducts = await mapWithModifiersAsync(config.conducts, modifiers) as IConduct[];

    console.log('new config', triggers, condition, conducts);

    const configMapped = makeAutoObservable({
        triggers: triggers.filter(t => typeof t !== undefined),
        condition: condition,
        conducts: conducts.filter(c => typeof c !== undefined)
    });

    return configMapped;
}

const DisplayValue = observer((props: { value: any | undefined, dataType: string, onChanged: (value: any | undefined) => void }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [dataType, setDataType] = useState(props.dataType);
    const [value, setValue] = useState<string>(props.value || '');

    useEffect(() => {
        if (!dataType) {
            setDataType(props.dataType);
        }
    }, [dataType, props.dataType]);

    const handleValueClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget)
    };

    const handleEditOptionSelected = (value: boolean | string | number | undefined) => {
        props.onChanged(value);
        handleClosed();
    };

    const handleClosedApplyValue = () => {
        let submitvalue: any = value;
        if (dataType === 'double' || dataType === 'colortemp') {
            submitvalue = parseFloat(value) || 0;
        }
        handleEditOptionSelected(submitvalue);
        handleClosed();
    };

    const handleClosed = () => {
        setMenuAnchorEl(null);
    };

    let label: string | React.ReactNode = 'None';
    if (dataType === 'bool' || dataType === 'any') {
        label = props.value?.toString() || 'Unknown';
    } else if (dataType === 'string') {
        label = `"${props.value}"`;
    } else if (dataType === 'double' || dataType === 'colortemp') {
        label = props.value;
    }

    return (
        <>
            <ButtonBase onClick={handleValueClick} aria-controls="displayvalue-select-menu" aria-haspopup="true">
                <Chip label={label} />
            </ButtonBase>
            {(dataType === 'bool' && Boolean(menuAnchorEl)) &&
                <Menu id="displayvalue-select-menu" open={Boolean(menuAnchorEl)} anchorEl={menuAnchorEl} keepMounted onClose={handleClosed}>
                    <MenuItem onClick={() => handleEditOptionSelected(true)}>true</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(false)}>false</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(undefined)}>None</MenuItem>
                </Menu>}
            {(dataType === 'string' && Boolean(menuAnchorEl)) &&
                <Popover open={true} anchorEl={menuAnchorEl} onClose={handleClosedApplyValue}>
                    <Paper sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography>String</Typography>
                            <TextField size="small" value={value} onChange={(e) => setValue(e.target.value)} />
                        </Stack>
                    </Paper>
                </Popover>}
            {((dataType === 'double' || dataType === 'colortemp') && Boolean(menuAnchorEl)) &&
                <Popover open={true} anchorEl={menuAnchorEl} onClose={handleClosedApplyValue}>
                    <Paper sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography>{dataType === 'double' ? 'Value' : 'Color temperature'}</Typography>
                            <TextField size="small" value={value} onChange={(e) => setValue(e.target.value)} />
                        </Stack>
                    </Paper>
                </Popover>}
        </>
    );
});

const DisplayConditionComparisonValueOperation = (props: { valueOperation?: string }) => {
    let sign = '=';
    switch (props.valueOperation) {
        case 'EqualOrNull': sign = '?='; break;
        case 'GreaterThan': sign = '>'; break;
        case 'LessThan': sign = '<'; break;
        default: break;
    }

    return (
        <div>{sign}</div>
    );
};

const DisplayConditionValueComparison = (props: { comparison: IConditionValueComparison, onChanged: (updated: IConditionValueComparison) => void }) => {
    const handleChanged = (side: 'left' | 'right', updated?: IDeviceTargetIncomplete | any | undefined) => {
        const stateValue = isIDeviceStateValue(updated) ? updated : undefined;
        const deviceTarget = isIDeviceStateTarget(updated) ? updated : undefined;
        let conditionDeviceStatetarget: IConditionDeviceStateTarget | undefined = undefined;
        if (deviceTarget !== undefined)
            conditionDeviceStatetarget = { target: deviceTarget };

        props.onChanged({
            left: side === 'left' ? (stateValue ?? conditionDeviceStatetarget) : props.comparison.left,
            right: side === 'right' ? updated : props.comparison.right,
            operation: props.comparison.operation,
            valueOperation: props.comparison.valueOperation
        });
    };

    return (
        <Stack alignItems="center" spacing={1} direction="row">
            {props.comparison.operation &&
                <div>{props.comparison.operation}</div>}
            {
                isIDeviceStateValue(props.comparison.left)
                    ? <DisplayValue dataType="any" value={props.comparison.left.value} onChanged={(updated) => handleChanged('left', updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.left)
                        ? <DisplayDeviceTarget target={props.comparison.left.target} onChanged={(updated) => handleChanged('left', updated)} />
                        : <span>Unknown</span>)
            }
            <DisplayConditionComparisonValueOperation valueOperation={props.comparison.valueOperation} />
            {
                isIDeviceStateValue(props.comparison.right)
                    ? <DisplayValue dataType="any" value={props.comparison.right.value} onChanged={(updated) => handleChanged('right', updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.right)
                        ? <DisplayDeviceTarget target={props.comparison.right.target} onChanged={(updated) => handleChanged('right', updated)} />
                        : <span>Unknown</span>)
            }
        </Stack>
    );
}

const DisplayItemPlaceholder = () => (
    <Grid container direction="row" spacing={1}>
        <Grid item>
            <Skeleton variant="text" width={120} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={40} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={180} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={30} height={40} />
        </Grid>
    </Grid>
);

const DisplayCondition = observer((props: { condition: ICondition, onChanged: (updated: ICondition) => void, isTopLevel: boolean }) => {
    const handleConditionOperationSelection = () => {

    };

    return (
        <Stack direction="row">
            {!props.isTopLevel && (
                <ButtonBase onClick={handleConditionOperationSelection} aria-controls="condition-operation-select-menu" aria-haspopup="true">
                    <Chip label={props.condition.operation?.toString() ?? 'None'} title={`${props.condition.operation}`} />
                </ButtonBase>
            )}
            <Stack>
                {props.condition.operations.map((op, i) => {
                    if (isICondition(op))
                        return <DisplayCondition key={i} condition={op} isTopLevel={false} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                operation: props.condition.operation,
                                operations: updatedOperations
                            });
                        }} />;
                    else if (isIConditionValueComparison(op))
                        return <DisplayConditionValueComparison key={i} comparison={op as IConditionValueComparison} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                operation: props.condition.operation,
                                operations: updatedOperations
                            });
                        }} />;
                    else
                        return (<span>Unknown</span>);
                })}
            </Stack>
        </Stack>
    );
});

const DisplayDeviceStateValue = observer((props: { target?: IDeviceTargetIncomplete, value: any | undefined, onChanged: (updated?: IDeviceTargetState) => void }) => {
    const {
        target
    } = props;
    const device = useDevice(target?.deviceId);

    const contact = target?.channelName && target?.contactName
        ? device?.getContact({
            contactName: target?.contactName,
            channelName: target?.channelName,
            deviceId: device.id
        })
        : null;

    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <DisplayDeviceTarget target={target} onChanged={(value) => {
                    props.onChanged({
                        target: value,
                        value: typeof value?.contactName !== 'undefined' ? props.value : undefined
                    });
                }} />
            </Grid>
            <Grid item>
                <span>set</span>
            </Grid>
            <Grid item>
                {contact ?
                    <DisplayValue dataType={contact.dataType} value={props.value} onChanged={(value) => {
                        props.onChanged({
                            target: target,
                            value: typeof target?.contactName !== 'undefined' ? value : undefined
                        });
                    }} />
                    : <Skeleton />}
            </Grid>
        </Grid>
    );
});

const ProcessItem = (props: { children: React.ReactNode, in?: boolean }) => (
    <Collapse in={props.in} sx={{ pb: 1 }}>
        <Paper sx={{ p: 2 }} variant="elevation" elevation={0}>
            {props.children}
        </Paper>
    </Collapse>
);

const ProcessSection = (props: { header: string, isLoading: boolean, onAdd: () => void, addTitle: string }) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography>{props.header}</Typography>
        <IconButton disabled={props.isLoading} onClick={props.onAdd} title={props.addTitle}><AddSharpIcon /></IconButton>
    </Stack>
)

const ProcessDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useLocale('App', 'Processes');

    const loadProcess = useCallback(async () => {
        if (typeof id !== 'undefined' && typeof id !== 'object')
            return await ProcessesRepository.getProcessAsync(id)
    }, [id]);
    const process = useLoadAndError(loadProcess);

    const loadProcessConfig = useCallback(async () => {
        if (process.item)
            return await parseProcessConfigurationAsync(process.item.configurationSerialized)
    }, [process.item]);
    const processConfig = useLoadAndError(loadProcessConfig);

    const persistProcessAsync = async () => {
        if (process == null) {
            console.error('Can\'t persist null process.');
            return;
        }

        const mappedConfig = await mapWithModifiersAsync(processConfig as KeyedObjectOrAny, [
            deviceToIdentifierModifier,
            contactNameToContactModifier,
            channelNameToChannelModifier
        ]);

        const configSerialized = JSON.stringify(mappedConfig);

        console.log('TODO: Persist process', configSerialized);
        //await ProcessesRepository.saveProcessConfigurationAsync(process?.id, configSerialized);
    };

    const handleTriggerChange = (index: number, updated?: IDeviceStateTrigger) => {
        // TODO: Use action to change state
        if (processConfig.item) {
            if (updated)
                processConfig.item.triggers[index] = updated;
            else processConfig.item.triggers.splice(index, 1);
        }

        persistProcessAsync();
    }

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        if (processConfig.item)
            processConfig.item.condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (index: number, updated?: IDeviceTargetState) => {
        // TODO: Use action to change state
        if (processConfig.item) {
            processConfig.item.conducts[index].value = updated?.value;
            const target = processConfig.item.conducts[index].target;
            if (typeof target !== 'undefined' &&
                updated?.target?.deviceId) {
                target.channelName = updated.target.channelName;
                target.contactName = updated.target.contactName;
                target.deviceId = updated.target.deviceId;
            } else if (updated?.target?.deviceId) {
                processConfig.item.conducts[index].target = {
                    channelName: updated.target?.channelName,
                    contactName: updated.target?.contactName,
                    deviceId: updated.target?.deviceId,
                }
            }
        }

        persistProcessAsync();
    };

    const handleAddConduct = () => {
        if (processConfig.item)
            processConfig.item.conducts.push(new Conduct());
    };

    const handleAddTrigger = () => {
        if (processConfig.item)
            processConfig.item.triggers.push(new DeviceStateTrigger());
    }

    const handleAddCondition = () => {
        if (processConfig.item) {
            const condition = processConfig.item.condition;
            if (condition)
                condition.operations.push(new Condition());
        }
    }

    const handleDelete = async () => {
        if (process.item) {
            await EntityRepository.deleteAsync(process.item.id, 2);
            router.push('/app/processes');
        }
    }

    return (
        <>
            {process.error && <Alert severity="error">{process.error}</Alert>}
            <Container sx={{ pt: { xs: 0, sm: 4 } }}>
                <Stack spacing={2}>
                    <Stack spacing={2}>
                        {process.isLoading ?
                            <Skeleton variant="text" width={260} height={38} /> :
                            <Typography variant="h2">{process.item?.alias ?? 'Unknown'}</Typography>}
                        <Box>
                            <ConfirmDeleteButton
                                buttonLabel={t('DeleteProcessButtonLabel')}
                                title={t('DeleteProcessTitle')}
                                expectedConfirmText={process.item?.alias || t('ConfirmDialogExpectedText')}
                                onConfirm={handleDelete} />
                        </Box>
                    </Stack>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <ProcessSection header={t('Triggers')} isLoading={processConfig.isLoading} onAdd={handleAddTrigger} addTitle={t('AddTrigger')} />
                            <TransitionGroup>{processConfig.item?.triggers?.map((t, i) => <ProcessItem key={`trigger${i}`}><DisplayDeviceTarget target={t.deviceId ? { deviceId: t.deviceId, contactName: t.contactName, channelName: t.channelName } : undefined} onChanged={(updated) => handleTriggerChange(i, updated)} /></ProcessItem>)}</TransitionGroup>
                            {processConfig.isLoading ? <DisplayItemPlaceholder /> :
                                ((processConfig.item?.triggers?.length ?? 0) <= 0 && <NoDataPlaceholder content={t('NoTriggers')} />)}
                        </Stack>
                        <Stack spacing={1}>
                            <ProcessSection header={t('Conditions')} isLoading={processConfig.isLoading} onAdd={handleAddCondition} addTitle={t('AddCondition')} />
                            {processConfig.isLoading ? <><DisplayItemPlaceholder /><DisplayItemPlaceholder /><DisplayItemPlaceholder /></> :
                                (processConfig.item?.condition
                                    ? <ProcessItem in><DisplayCondition isTopLevel condition={processConfig.item.condition} onChanged={handleConditionChange} /></ProcessItem>
                                    : <NoDataPlaceholder content={t('NoConductions')} />)}
                        </Stack>
                        <Stack spacing={1}>
                            <ProcessSection header={t('Conducts')} isLoading={processConfig.isLoading} onAdd={handleAddConduct} addTitle={t('AddConduct')} />
                            <TransitionGroup>{processConfig.item?.conducts?.map((c, i) => <ProcessItem key={`value${i}`}><DisplayDeviceStateValue target={c.target} value={c.value} onChanged={(u) => handleValueChanged(i, u)} /></ProcessItem>)}</TransitionGroup>
                            {processConfig.isLoading ? <><DisplayItemPlaceholder /><DisplayItemPlaceholder /></> :
                                ((processConfig.item?.conducts?.length ?? 0) <= 0 && <NoDataPlaceholder content={t('NoConducts')} />)}
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}

ProcessDetails.layout = AppLayoutWithAuth;

export default observer(ProcessDetails);
