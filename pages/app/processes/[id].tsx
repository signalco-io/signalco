import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, ButtonBase, Chip, Grid, Menu, MenuItem, Paper, Popover, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel } from '../../../src/processes/ProcessesRepository';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { makeAutoObservable } from 'mobx';
import { DeviceModel, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import DisplayDeviceTarget from '../../../components/shared/entity/DisplayDeviceTarget';

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

class Condition implements ICondition {
    operation?: string | undefined;
    operations: (IConditionValueComparison | ICondition)[] = [];
}

const isIConditionValueComparison = (arg: any): arg is IConditionValueComparison => arg.Left !== undefined && arg.Right !== undefined;
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

function parseTrigger(trigger: any): IDeviceStateTrigger | undefined {
    if (typeof trigger.channel === 'undefined' ||
        typeof trigger.deviceId === 'undefined' ||
        typeof trigger.contact === 'undefined') {
        return undefined;
    }

    return trigger;
}

function parseCondition(condition: any): ICondition | undefined {
    return condition;
}

function parseConduct(conduct: any): IConduct | undefined {
    return conduct;
}

function parseProcessConfiguration(configJson: string | undefined) {
    const config = JSON.parse(configJson ?? "");

    const triggers = typeof config.triggers !== 'undefined' && Array.isArray(config.triggers)
        ? (config.triggers.map((t: any) => parseTrigger(t)) as IDeviceStateTrigger[])
        : new Array<IDeviceStateTrigger>();
    const condition = typeof config.condition !== 'undefined'
        ? parseCondition(config.condition) as ICondition
        : {} as ICondition | undefined;
    const conducts = typeof config.conducts !== 'undefined' && Array.isArray(config.conducts)
        ? config.conducts.map((t: any) => parseConduct(t)) as IConduct[]
        : new Array<IConduct>();

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
    const [value, setValue] = useState<string>(props.value || "");

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

    let label: string | React.ReactNode = "None";
    if (dataType === 'bool' || dataType === "any") {
        label = props.value?.toString() || "Unknown";
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
    let sign = "=";
    switch (props.valueOperation) {
        case "EqualOrNull": sign = "?="; break;
        case "GreaterThan": sign = ">"; break;
        case "LessThan": sign = "<"; break;
        default: break;
    }

    return (
        <div>{sign}</div>
    );
};

const DisplayConditionValueComparison = (props: { comparison: IConditionValueComparison, onChanged: (updated: IConditionValueComparison) => void }) => {
    const handleChanged = (side: "left" | "right", updated?: IDeviceTargetIncomplete | any | undefined) => {
        const stateValue = isIDeviceStateValue(updated) ? updated : undefined;
        const deviceTarget = isIDeviceStateTarget(updated) ? updated : undefined;
        let conditionDeviceStatetarget: IConditionDeviceStateTarget | undefined = undefined;
        if (deviceTarget !== undefined)
            conditionDeviceStatetarget = { target: deviceTarget };

        props.onChanged({
            left: side === "left" ? (stateValue ?? conditionDeviceStatetarget) : props.comparison.left,
            right: side === "right" ? updated : props.comparison.right,
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
                    ? <DisplayValue dataType="any" value={props.comparison.left.value} onChanged={(updated) => handleChanged("left", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.left)
                        ? <DisplayDeviceTarget target={props.comparison.left.target} onChanged={(updated) => handleChanged("left", updated)} />
                        : <span>Unknown</span>)
            }
            <DisplayConditionComparisonValueOperation valueOperation={props.comparison.valueOperation} />
            {
                isIDeviceStateValue(props.comparison.right)
                    ? <DisplayValue dataType="any" value={props.comparison.right.value} onChanged={(updated) => handleChanged("right", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.right)
                        ? <DisplayDeviceTarget target={props.comparison.right.target} onChanged={(updated) => handleChanged("right", updated)} />
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
                    <Chip label={props.condition.operation?.toString() ?? "None"} title={`${props.condition.operation}`} />
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
    const [device, setDevice] = useState<DeviceModel | undefined>();
    const {
        target
    } = props;

    useEffect(() => {
        const loadDevice = async () => {
            if (target?.deviceId) {
                setDevice(await DevicesRepository.getDeviceByIdentifierAsync(target.deviceId));
            } else {
                // TODO: Display error if device identifier is not provided
            }
        };

        loadDevice();
    }, [target?.deviceId]);

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

const ProcessDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [process, setProcess] = useState<IProcessModel | undefined>();
    const [processConfig, setProcessConfig] = useState<{
        triggers: IDeviceStateTrigger[],
        condition: ICondition | undefined,
        conducts: IConduct[]
    } | undefined>(undefined);

    useEffect(() => {
        const loadDeviceAsync = async () => {
            try {
                if (typeof id !== "object" &&
                    typeof id !== 'undefined') {
                    const loadedProcess = await ProcessesRepository.getProcessAsync(id);
                    setProcess(loadedProcess);
                    if (loadedProcess) {
                        setProcessConfig(parseProcessConfiguration(loadedProcess.configurationSerialized));
                    }
                }
            } catch (err: any) {
                setError(err?.toString());
            } finally {
                setIsLoading(false);
            }
        };

        loadDeviceAsync();
    }, [id]);

    const persistProcessAsync = () => {
        if (process == null) {
            console.error("Can't persist null process.");
            return;
        }

        const configSerialized = JSON.stringify(processConfig);

        ProcessesRepository.saveProcessConfigurationAsync(process?.id, configSerialized);
    };

    const handleTriggerChange = (index: number, updated?: IDeviceStateTrigger) => {
        // TODO: Use action to change state
        if (processConfig) {
            if (updated)
                processConfig.triggers[index] = updated;
            else processConfig.triggers.splice(index, 1);
        }

        persistProcessAsync();
    }

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        console.log(updated);
        if (processConfig)
            processConfig.condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (index: number, updated?: IDeviceTargetState) => {
        // TODO: Use action to change state
        if (processConfig) {
            processConfig.conducts[index].value = updated?.value;
            const target = processConfig.conducts[index].target;
            if (typeof target !== 'undefined' &&
                updated?.target?.deviceId) {
                target.channelName = updated.target.channelName;
                target.contactName = updated.target.contactName;
                target.deviceId = updated.target.deviceId;
            } else if (updated?.target?.deviceId) {
                processConfig.conducts[index].target = {
                    channelName: updated.target?.channelName,
                    contactName: updated.target?.contactName,
                    deviceId: updated.target?.deviceId,
                }
            }
        }

        persistProcessAsync();
    };

    const handleAddConduct = () => {
        if (processConfig)
            processConfig.conducts.push(new Conduct());
    };

    const handleAddTrigger = () => {
        if (processConfig)
            processConfig.triggers.push(new DeviceStateTrigger());
    }

    const handleAddCondition = () => {
        if (processConfig) {
            const condition = processConfig.condition;
            if (condition)
                condition.operations.push(new Condition());
        }
    }

    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ px: { sm: 2 }, py: 2 }}>
                <Grid container spacing={2} direction="column" wrap="nowrap">
                    <Grid item>
                        {isLoading ?
                            <Skeleton variant="text" width={260} height={60} /> :
                            <Typography variant="h1">{process?.alias ?? "Unknown"}</Typography>}
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={12} md={6}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelTriggers-content"
                                        id="panelTriggers-header"
                                    >
                                        <Typography>Triggers</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <DisplayItemPlaceholder />}
                                            {!isLoading &&
                                                (processConfig?.triggers?.length
                                                    ? processConfig.triggers.map((t, i) => <DisplayDeviceTarget key={`trigger${i}`} target={t.deviceId ? { deviceId: t.deviceId, contactName: t.contactName, channelName: t.channelName } : undefined} onChanged={(updated) => handleTriggerChange(i, updated)} />)
                                                    : <NoDataPlaceholder content="No triggers" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddTrigger}>Add trigger</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelConditions-content"
                                        id="panelConditions-header"
                                    >
                                        <Typography>Conditions</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                            {!isLoading &&
                                                (typeof processConfig?.condition !== 'undefined'
                                                    ? <DisplayCondition isTopLevel condition={processConfig.condition} onChanged={handleConditionChange} />
                                                    : <NoDataPlaceholder content="No condition" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddCondition}>Add condition</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelConducts-content"
                                        id="panelConducts-header"
                                    >
                                        <Typography>Conducts</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                            {!isLoading &&
                                                (processConfig?.conducts?.length
                                                    ? processConfig.conducts.map((c, i) => <DisplayDeviceStateValue key={`value${i}`} target={c.target} value={c.value} onChanged={(u) => handleValueChanged(i, u)} />)
                                                    : <NoDataPlaceholder content="No conducts" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddConduct}>Add conduct</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

ProcessDetails.layout = AppLayoutWithAuth;

export default observer(ProcessDetails);
