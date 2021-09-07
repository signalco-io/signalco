import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, ButtonBase, Chip, Grid, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel } from '../../../src/processes/ProcessesRepository';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { makeAutoObservable } from 'mobx';
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import { selectMany } from '../../../src/helpers/ArrayHelpers';

interface IDeviceContactTarget {
    Channel: string | undefined;
    Contact: string | undefined;
}

interface IDeviceStateTarget extends IDeviceContactTarget {
    Identifier: string | undefined;
}

class DeviceStateTarget implements IDeviceStateTarget {
    Identifier: string | undefined;
    Channel: string | undefined;
    Contact: string | undefined;

    constructor(identifier?: string, channel?: string, contact?: string) {
        this.Identifier = identifier;
        this.Channel = channel;
        this.Contact = contact;
    }
}

interface IDeviceStateValue {
    Value?: any
}

interface IDeviceTargetState {
    Target: IDeviceStateTarget;
    Value: any | undefined;
}

const isIDeviceStateValue = (arg: any): arg is IDeviceStateValue => arg?.Value !== undefined;
const isIConditionDeviceStateTarget = (arg: any): arg is IConditionDeviceStateTarget => arg?.Target !== undefined;
const isIDeviceStateTarget = (arg: any): arg is IDeviceStateTarget => arg?.Identifier !== undefined && typeof arg?.Contact !== 'undefined' && typeof arg?.Channel !== 'undefined';

interface IDeviceStateTrigger extends IDeviceStateTarget { }

class DeviceStateTrigger implements IDeviceStateTrigger {
    Identifier: string | undefined;
    Channel: string | undefined;
    Contact: string | undefined;
}

interface IConditionDeviceStateTarget {
    Target: IDeviceStateTarget;
}

interface IConditionValueComparison {
    Operation?: string,
    Left: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
    ValueOperation?: string,
    Right: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
}

interface ICondition {
    Operation?: string,
    Operations: Array<IConditionValueComparison | ICondition>
}

class Condition implements ICondition {
    Operation?: string | undefined;
    Operations: (IConditionValueComparison | ICondition)[] = [];
}

const isIConditionValueComparison = (arg: any): arg is IConditionValueComparison => arg.Left !== undefined && arg.Right !== undefined;
const isICondition = (arg: any): arg is ICondition => arg.Operations !== undefined;

interface IConduct extends IDeviceTargetState {
}

class Conduct implements IConduct {
    Target: IDeviceStateTarget;
    Value: any;

    constructor(target?: IDeviceStateTarget, value?: any) {
        this.Target = target || new DeviceStateTarget();
        this.Value = value;

        makeAutoObservable(this);
    }
}

function parseTrigger(trigger: any): IDeviceStateTrigger | undefined {
    if (typeof trigger.Channel === 'undefined' ||
        typeof trigger.Identifier === 'undefined' ||
        typeof trigger.Contact === 'undefined') {
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

    const triggers = typeof config.Triggers !== 'undefined' && Array.isArray(config.Triggers)
        ? (config.Triggers.map((t: any) => parseTrigger(t)) as IDeviceStateTrigger[])
        : new Array<IDeviceStateTrigger>();
    const condition = typeof config.Condition !== 'undefined'
        ? parseCondition(config.Condition) as ICondition
        : {} as ICondition | undefined;
    const conducts = typeof config.Conducts !== 'undefined' && Array.isArray(config.Conducts)
        ? config.Conducts.map((t: any) => parseConduct(t)) as IConduct[]
        : new Array<IConduct>();

    const configMapped = makeAutoObservable({
        Triggers: triggers.filter(t => typeof t !== undefined),
        Condition: condition,
        Conducts: conducts.filter(c => typeof c !== undefined)
    });

    return configMapped;
}

const DisplayDeviceTarget = observer((props: { target?: IDeviceStateTarget, onChanged: (updated: IDeviceStateTarget) => void }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);
    const [contactMenuAnchorEl, setContactMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [devicesMenuAnchorEl, setDevicesMenuAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                if (props.target?.Identifier) {
                    const device = await DevicesRepository.getDeviceByIdentifierAsync(props.target.Identifier);
                    if (device) {
                        setDevice(device);
                    }
                } else {
                    console.debug("No device to load. Target identifier: ", props.target?.Identifier);
                }
            }
            catch (err: any) {
                console.warn("Failed to load device target", props.target, err);
            }
            finally {
                setIsLoading(false);
            }
        })();
    }, [props.target, props.target?.Identifier]);

    const DeviceSelection = ({ onSelected }: { onSelected: (device: IDeviceModel | undefined) => void }) => {
        const [devices, setDevices] = useState<IDeviceModel[] | undefined>();

        useEffect(() => {
            (async () => {
                try {
                    const devices = await DevicesRepository.getDevicesAsync();
                    setDevices(devices);
                } catch (err: any) {
                    console.warn("Failed to load device selection devices.", err);
                } finally {
                    // TODO: Set loading false
                }
            })();
        }, []);

        if (typeof devices === 'undefined')
            return <>
                <MenuItem disabled>Loading...</MenuItem>
            </>;

        return (
            <>
                <MenuItem onClick={() => onSelected(undefined)} selected={typeof props.target?.Identifier === 'undefined'}>None</MenuItem>
                {devices.map(d =>
                    <MenuItem
                        key={d.identifier}
                        onClick={() => onSelected(d)}
                        selected={props.target?.Identifier === d.identifier}>
                        {`${d.alias}`}
                    </MenuItem>)}
            </>
        );
    };

    const ContactSelection = ({ onSelected }: { onSelected: (contact: IDeviceContactTarget | undefined) => void }) => {
        if (typeof device === 'undefined')
            return <>
                <MenuItem disabled>Select device first</MenuItem>
            </>;

        const items = selectMany(device.endpoints, e => e.contacts.map(c => {
            return {
                Contact: c.name,
                Channel: e.channel
            } as IDeviceContactTarget
        }));

        return (
            <>
                <MenuItem onClick={() => onSelected(undefined)} selected={typeof props.target?.Channel === 'undefined' || typeof props.target?.Contact === 'undefined'}>None</MenuItem>
                {items.map(i =>
                    <MenuItem
                        key={`${i.Channel}-${i.Contact}`}
                        onClick={() => onSelected(i)}
                        selected={props.target?.Contact === i.Contact && props.target?.Channel === i.Channel}>
                        {`${i.Contact} (${i.Channel})`}
                    </MenuItem>)}
            </>
        );
    }

    const handleDevicesSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
        setDevicesMenuAnchorEl(event.currentTarget);
    }

    const handleDevicesSelected = (device: IDeviceModel | undefined) => {
        // Retrieve available contact, set undefined if no matching
        let channel = props.target?.Channel;
        let contact = props.target?.Contact;
        if (typeof device?.endpoints.filter(e => e.channel === channel)[0]?.contacts.filter(c => c.name === contact) === 'undefined') {
            channel = undefined;
            contact = undefined;
        }

        props.onChanged({
            Identifier: device?.identifier,
            Channel: channel,
            Contact: contact
        });
        handleDevicesSelectionClosed();
    }

    const handleDevicesSelectionClosed = () => {
        setDevicesMenuAnchorEl(null);
    }

    const handleContactSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
        setContactMenuAnchorEl(event.currentTarget);
    }

    const handleContactSelected = (contact: IDeviceContactTarget | undefined) => {
        props.onChanged({
            Identifier: props.target?.Identifier,
            Channel: contact?.Channel,
            Contact: contact?.Contact
        });
        handleContactSelectionClosed();
    }

    const handleContactSelectionClosed = () => {
        setContactMenuAnchorEl(null);
    }

    const ITEM_HEIGHT = 48;

    return (
        <Stack direction="row" spacing={1}>
            <ButtonBase onClick={handleDevicesSelection} aria-controls="devicetarget-devices-select-menu" aria-haspopup="true">
                <Chip label={isLoading ? <Skeleton width={160} variant="text" /> : ((device?.alias ?? props.target?.Identifier) ?? "None")} title={props.target?.Identifier} />
            </ButtonBase>
            {Boolean(devicesMenuAnchorEl) &&
                <Menu
                    id="devicetarget-devices-select-menu"
                    open={Boolean(devicesMenuAnchorEl)}
                    anchorEl={devicesMenuAnchorEl}
                    keepMounted
                    onClose={handleDevicesSelectionClosed}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 6.5,
                            width: '30ch',
                        },
                    }}>
                    <DeviceSelection onSelected={handleDevicesSelected} />
                </Menu>}
            {props.target?.Identifier !== undefined && (
                <>
                    <ButtonBase onClick={handleContactSelection} aria-controls="devicetarget-contact-select-menu" aria-haspopup="true">
                        <Chip label={props.target.Contact ?? "None"} title={`${props.target.Channel} | ${props.target.Contact}`} />
                    </ButtonBase>
                    <>
                        {Boolean(contactMenuAnchorEl) &&
                            <Menu
                                id="devicetarget-contact-select-menu"
                                open={Boolean(contactMenuAnchorEl)}
                                anchorEl={contactMenuAnchorEl}
                                keepMounted
                                onClose={handleContactSelectionClosed}>
                                <ContactSelection onSelected={handleContactSelected} />
                            </Menu>}
                    </>
                </>
            )}
        </Stack>
    );
});

const DisplayValue = observer((props: { value: any | undefined, onChanged: (value: any | undefined) => void }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const handleValueClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget)
    };

    const handleEditOptionSelected = (value: boolean | undefined) => {
        props.onChanged(value);
        handleClosed();
    };

    const handleClosed = () => {
        setMenuAnchorEl(null);
    };

    let label: string | React.ReactNode = "None";
    const valueType = typeof props.value;
    if (valueType === 'boolean') {
        label = props.value.toString();
    } else if (valueType === 'string') {
        label = `"${props.value}"`;
    } else if (valueType === 'number') {
        label = props.value;
    }

    return (
        <>
            <ButtonBase onClick={handleValueClick} aria-controls="displayvalue-select-menu" aria-haspopup="true">
                <Chip label={label} />
            </ButtonBase>
            {Boolean(menuAnchorEl) &&
                <Menu id="displayvalue-select-menu" open={Boolean(menuAnchorEl)} anchorEl={menuAnchorEl} keepMounted onClose={handleClosed}>
                    <MenuItem onClick={() => handleEditOptionSelected(true)}>true</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(false)}>false</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(undefined)}>None</MenuItem>
                </Menu>}
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
    const handleChanged = (side: "left" | "right", updated: IDeviceStateTarget | any | undefined) => {
        const stateValue = isIDeviceStateValue(updated) ? updated : undefined;
        const deviceTarget = isIDeviceStateTarget(updated) ? updated : undefined;
        let conditionDeviceStateTarget: IConditionDeviceStateTarget | undefined = undefined;
        if (deviceTarget !== undefined)
            conditionDeviceStateTarget = { Target: deviceTarget };

        props.onChanged({
            Left: side === "left" ? (stateValue ?? conditionDeviceStateTarget) : props.comparison.Left,
            Right: side === "right" ? updated : props.comparison.Right,
            Operation: props.comparison.Operation,
            ValueOperation: props.comparison.ValueOperation
        });
    };

    return (
        <Stack alignItems="center" spacing={1} direction="row">
            {props.comparison.Operation &&
                <div>{props.comparison.Operation}</div>}
            {
                isIDeviceStateValue(props.comparison.Left)
                    ? <DisplayValue value={props.comparison.Left.Value} onChanged={(updated) => handleChanged("left", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.Left)
                        ? <DisplayDeviceTarget target={props.comparison.Left.Target} onChanged={(updated) => handleChanged("left", updated)} />
                        : <span>Unknown</span>)
            }
            <DisplayConditionComparisonValueOperation valueOperation={props.comparison.ValueOperation} />
            {
                isIDeviceStateValue(props.comparison.Right)
                    ? <DisplayValue value={props.comparison.Right.Value} onChanged={(updated) => handleChanged("right", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.Right)
                        ? <DisplayDeviceTarget target={props.comparison.Right.Target} onChanged={(updated) => handleChanged("right", updated)} />
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
                    <Chip label={props.condition.Operation?.toString() ?? "None"} title={`${props.condition.Operation}`} />
                </ButtonBase>
            )}
            <Stack>
                {props.condition.Operations.map((op, i) => {
                    if (isICondition(op))
                        return <DisplayCondition key={i} condition={op} isTopLevel={false} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.Operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                Operation: props.condition.Operation,
                                Operations: updatedOperations
                            });
                        }} />;
                    else if (isIConditionValueComparison(op))
                        return <DisplayConditionValueComparison key={i} comparison={op as IConditionValueComparison} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.Operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                Operation: props.condition.Operation,
                                Operations: updatedOperations
                            });
                        }} />;
                    else
                        return (<span>Unknown</span>);
                })}
            </Stack>
        </Stack>
    );
});

const DisplayDeviceStateValue = observer((props: { target: IDeviceStateTarget, value: any | undefined, onChanged: (updated: IDeviceTargetState) => void }) => (
    <Grid container alignItems="center" spacing={1}>
        <Grid item>
            <DisplayDeviceTarget target={props.target} onChanged={(value) => {
                props.onChanged({
                    Target: value,
                    Value: typeof value.Contact !== 'undefined' ? props.value : undefined
                });
            }} />
        </Grid>
        <Grid item>
            <span>set</span>
        </Grid>
        <Grid item>
            <DisplayValue value={props.value} onChanged={(value) => {
                props.onChanged({
                    Target: props.target,
                    Value: typeof props.target.Contact !== 'undefined' ? value : undefined
                });
            }} />
        </Grid>
    </Grid>
));

const ProcessDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [process, setProcess] = useState<IProcessModel | undefined>();
    const [processConfig, setProcessConfig] = useState<{
        Triggers: IDeviceStateTrigger[],
        Condition: ICondition | undefined,
        Conducts: IConduct[]
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

    const handleTriggerChange = (updated: IDeviceStateTrigger, index: number) => {
        // TODO: Use action to change state
        if (processConfig)
            processConfig.Triggers[index] = updated;

        persistProcessAsync();
    }

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        console.log(updated);
        if (processConfig)
            processConfig.Condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (updated: IDeviceTargetState, index: number) => {
        // TODO: Use action to change state
        if (processConfig) {
            processConfig.Conducts[index].Value = updated.Value;
            processConfig.Conducts[index].Target.Channel = updated.Target.Channel;
            processConfig.Conducts[index].Target.Contact = updated.Target.Contact;
            processConfig.Conducts[index].Target.Identifier = updated.Target.Identifier;
        }

        persistProcessAsync();
    };

    const handleAddConduct = () => {
        if (processConfig)
            processConfig.Conducts.push(new Conduct());
    };

    const handleAddTrigger = () => {
        if (processConfig)
            processConfig.Triggers.push(new DeviceStateTrigger());
    }

    const handleAddCondition = () => {
        if (processConfig) {
            const condition = processConfig.Condition;
            if (condition)
                condition.Operations.push(new Condition());
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
                                                (processConfig?.Triggers?.length
                                                    ? processConfig.Triggers.map((t, i) => <DisplayDeviceTarget key={`trigger${i}`} target={t} onChanged={(updated) => handleTriggerChange(updated, i)} />)
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
                                                (typeof processConfig?.Condition !== 'undefined'
                                                    ? <DisplayCondition isTopLevel condition={processConfig.Condition} onChanged={handleConditionChange} />
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
                                                (processConfig?.Conducts?.length
                                                    ? processConfig.Conducts.map((c, i) => <DisplayDeviceStateValue key={`value${i}`} target={c.Target} value={c.Value} onChanged={(u) => handleValueChanged(u, i)} />)
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

ProcessDetails.layout = AppLayout;

export default observer(ProcessDetails);
