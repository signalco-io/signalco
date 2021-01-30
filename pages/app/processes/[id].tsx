import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, ButtonBase, Chip, Grid, Menu, MenuItem, Skeleton, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel } from '../../../src/processes/ProcessesRepository';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@material-ui/icons/AddSharp';
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

const isIConditionValueComparison = (arg: any): arg is IConditionValueComparison => arg.Left !== undefined && arg.Right !== undefined;
const isICondition = (arg: any): arg is ICondition => arg.Operations !== undefined;

interface IConduct extends IDeviceTargetState {
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
        ? config.Triggers.map((t: any) => parseTrigger(t)) as IDeviceStateTrigger[]
        : new Array<IDeviceStateTrigger>();
    const condition = typeof config.Condition !== 'undefined'
        ? parseCondition(config.Condition) as ICondition
        : {} as ICondition | undefined;
    const conducts = typeof config.Conducts !== 'undefined' && Array.isArray(config.Conducts)
        ? config.Conducts.map((t: any) => parseConduct(t)) as IConduct[]
        : new Array<IConduct>();

    const configMapped = makeAutoObservable({
        triggers: triggers.filter(t => typeof t !== undefined),
        condition: condition,
        conducts: conducts.filter(c => typeof c !== undefined)
    });

    return configMapped;
}

const DisplayDeviceTarget = observer((props: { target: IDeviceStateTarget, onChanged: (updated: IDeviceStateTarget) => void }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);
    const [contactMenuAnchorEl, setContactMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [devicesMenuAnchorEl, setDevicesMenuAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const devices = await DevicesRepository.getDevicesAsync();
                const device = devices.filter(d => d.identifier === props.target.Identifier)[0];
                setDevice(device);
            }
            catch (err) {
                console.warn("Failed to load device target", props.target);
            }
            finally {
                setIsLoading(false);
            }
        })();
    }, [props.target.Identifier]);

    const DeviceSelection = ({ onSelected }: { onSelected: (device: IDeviceModel | undefined) => void }) => {
        const [devices, setDevices] = useState<IDeviceModel[] | undefined>();

        useEffect(() => {
            (async () => {
                try {
                    const devices = await DevicesRepository.getDevicesAsync();
                    setDevices(devices);
                } catch (err) {
                    console.warn("Failed to load device selection devices.");
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
                <MenuItem onClick={() => onSelected(undefined)} selected={typeof props.target.Identifier === 'undefined'}>None</MenuItem>
                {devices.map(d =>
                    <MenuItem
                        key={d.identifier}
                        onClick={() => onSelected(d)}
                        selected={props.target.Identifier === d.identifier}>
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
                <MenuItem onClick={() => onSelected(undefined)} selected={typeof props.target.Channel === 'undefined' || typeof props.target.Contact === 'undefined'}>None</MenuItem>
                {items.map(i =>
                    <MenuItem
                        key={`${i.Channel}-${i.Contact}`}
                        onClick={() => onSelected(i)}
                        selected={props.target.Contact === i.Contact && props.target.Channel === i.Channel}>
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
        let channel = props.target.Channel;
        let contact = props.target.Contact;
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
            Identifier: props.target.Identifier,
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
        <Grid container>
            <Grid item>
                <ButtonBase onClick={handleDevicesSelection} aria-controls="devicetarget-devices-select-menu" aria-haspopup="true">
                    <Chip label={isLoading ? <Skeleton width={160} variant="text" /> : ((device?.alias ?? props.target.Identifier) ?? "None")} title={props.target.Identifier} />
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
            </Grid>
            {props.target.Identifier !== undefined && (
                <Grid item>
                    <ButtonBase onClick={handleContactSelection} aria-controls="devicetarget-contact-select-menu" aria-haspopup="true">
                        <Chip label={props.target.Contact ?? "None"} title={`${props.target.Channel} | ${props.target.Contact}`} />
                    </ButtonBase>
                    {Boolean(contactMenuAnchorEl) &&
                        <Menu
                            id="devicetarget-contact-select-menu"
                            open={Boolean(contactMenuAnchorEl)}
                            anchorEl={contactMenuAnchorEl}
                            keepMounted
                            onClose={handleContactSelectionClosed}>
                            <ContactSelection onSelected={handleContactSelected} />
                        </Menu>}
                </Grid>
            )}
        </Grid>
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
        <Grid container alignItems="center" spacing={1}>
            {typeof props.comparison.Operation !== 'undefined' &&
                <Grid item>
                    <div>{props.comparison.Operation}</div>
                </Grid>}
            <Grid item>
                {
                    isIDeviceStateValue(props.comparison.Left)
                        ? <DisplayValue value={props.comparison.Left.Value} onChanged={(updated) => handleChanged("left", updated)} />
                        : (isIConditionDeviceStateTarget(props.comparison.Left)
                            ? <DisplayDeviceTarget target={props.comparison.Left.Target} onChanged={(updated) => handleChanged("left", updated)} />
                            : <span>Unknown</span>)
                }
            </Grid>
            <Grid item>
                <div>{props.comparison.ValueOperation?.toString() ?? "equals"}</div>
            </Grid>
            <Grid item>
                {
                    isIDeviceStateValue(props.comparison.Right)
                        ? <DisplayValue value={props.comparison.Right.Value} onChanged={(updated) => handleChanged("right", updated)} />
                        : (isIConditionDeviceStateTarget(props.comparison.Right)
                            ? <DisplayDeviceTarget target={props.comparison.Right.Target} onChanged={(updated) => handleChanged("right", updated)} />
                            : <span>Unknown</span>)
                }
            </Grid>
        </Grid>
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

const DisplayCondition = (props: { condition: ICondition, onChanged: (updated: ICondition) => void }) => (
    <Grid container>
        {props.condition.Operation &&
            <Grid item>
                {props.condition.Operation?.toString()}
            </Grid>
        }
        {props.condition.Operations.map((op, i) => {
            if (isICondition(op))
                return <DisplayCondition condition={op} onChanged={(updated) => {
                    const updatedOperations = [...props.condition.Operations];
                    updatedOperations[i] = updated;
                    props.onChanged({
                        Operation: props.condition.Operation,
                        Operations: updatedOperations
                    })
                }} />
            else if (isIConditionValueComparison(op))
                return <DisplayConditionValueComparison comparison={op as IConditionValueComparison} onChanged={(updated) => {
                    const updatedOperations = [...props.condition.Operations];
                    updatedOperations[i] = updated;
                    props.onChanged({
                        Operation: props.condition.Operation,
                        Operations: updatedOperations
                    })
                }} />
            else return (<span>Unknown</span>);
        })}
    </Grid>
);

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
        triggers: IDeviceStateTrigger[],
        condition: ICondition | undefined,
        conducts: IConduct[]
    } | undefined>(undefined);

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
        } catch (err) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDeviceAsync();
    }, [id]);

    const persistProcessAsync = () => {
        console.log("Persist TBD");
    };

    const handleTriggerChange = (updated: IDeviceStateTrigger, index: number) => {
        // TODO: Use action to change state
        if (processConfig)
            processConfig.triggers[index] = updated;

        persistProcessAsync();
    }

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        console.log(updated);
        if (processConfig)
            processConfig.condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (updated: IDeviceTargetState, index: number) => {
        // TODO: Use action to change state
        if (processConfig)
            processConfig.conducts[index] = updated;

        persistProcessAsync();
    };

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
                                        {isLoading && <DisplayItemPlaceholder />}
                                        {!isLoading &&
                                            (processConfig?.triggers?.length
                                                ? processConfig.triggers.map((t, i) => <DisplayDeviceTarget target={t} onChanged={(updated) => handleTriggerChange(updated, i)} />)
                                                : <NoDataPlaceholder content="No triggers" />)}
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
                                        {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                        {!isLoading &&
                                            (typeof processConfig?.condition !== 'undefined'
                                                ? <DisplayCondition condition={processConfig.condition} onChanged={handleConditionChange} />
                                                : <NoDataPlaceholder content="No condition" />)}
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
                                        {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                        <Grid container spacing={1} direction="column">
                                            <Grid item>
                                                {!isLoading &&
                                                    (processConfig?.conducts?.length
                                                        ? processConfig.conducts.map((c, i) => <DisplayDeviceStateValue target={c.Target} value={c.Value} onChanged={(u) => handleValueChanged(u, i)} />)
                                                        : <NoDataPlaceholder content="No conducts" />)}
                                            </Grid>
                                            <Grid item>
                                                <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading}>Add conduct</Button>
                                            </Grid>
                                        </Grid>
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