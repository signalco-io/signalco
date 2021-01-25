import { Box, Chip, Divider, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel } from '../../../src/processes/ProcessesRepository';

interface IDeviceStateTarget {
    Channel: string;
    Identifier: string;
    Contact: string;
}

interface IDeviceStateValue {
    Value?: any
}

interface IDeviceTargetState {
    Target: IDeviceStateTarget;
    Value: any | undefined;
}

const isIDeviceStateValue = (arg: any): arg is IDeviceStateValue => arg.Value !== undefined;
const isIConditionDeviceStateTarget = (arg: any): arg is IConditionDeviceStateTarget => arg.Target !== undefined;

interface IDeviceStateTrigger extends IDeviceStateTarget { }

interface IConditionDeviceStateTarget {
    Target: IDeviceStateTarget;
}

interface IConditionValueComparison {
    Operation?: string,
    Left: IDeviceStateTarget | IDeviceStateValue,
    ValueOperation?: string,
    Right: IDeviceStateTarget | IDeviceStateValue,
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
    //{ "Channel": "zigbee2mqtt", "Identifier": "zigbee2mqtt/0x00158d000478fe4e", "Contact": "action" }
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

    const configMapped = {
        triggers: triggers.filter(t => typeof t !== undefined),
        condition: condition,
        conducts: conducts.filter(c => typeof c !== undefined)
    }

    console.log(configMapped)

    return configMapped;
}

const DisplayDeviceTarget = (props: { target: IDeviceStateTarget }) => (
    <Grid container>
        <Grid item>
            <Chip label={(
                <>
                    <span>{props.target.Identifier}</span>
                    <Divider orientation="vertical" flexItem />
                    <span>{props.target.Channel}</span>
                </>)} />
        </Grid>
        <Grid item>
            <Chip label={props.target.Contact} />
        </Grid>
    </Grid>
);

const DisplayValue = (props: { value: any | undefined }) => {
    let label: string | React.ReactNode = "?";
    const valueType = typeof props.value;
    if (valueType === 'boolean') {
        label = props.value.toString();
    } else if (valueType === 'string') {
        label = `"${props.value}"`;
    } else if (valueType === 'number') {
        label = props.value;
    }

    return (
        <Chip label={label} />
    );
};

const DisplayConditionValueComparison = (props: { comparison: IConditionValueComparison }) => (
    <Grid container alignItems="center" spacing={1}>
        <Grid item>
            <div>{props.comparison.Operation?.toString() ?? ""}</div>
        </Grid>
        <Grid item>
            {
                isIDeviceStateValue(props.comparison.Left)
                    ? <DisplayValue value={props.comparison.Left.Value} />
                    : (isIConditionDeviceStateTarget(props.comparison.Left)
                        ? <DisplayDeviceTarget target={props.comparison.Left.Target} />
                        : <span>Unknown</span>)
            }
        </Grid>
        <Grid item>
            <div>{props.comparison.ValueOperation?.toString() ?? "equals"}</div>
        </Grid>
        <Grid item>
            {
                isIDeviceStateValue(props.comparison.Right)
                    ? <DisplayValue value={props.comparison.Right.Value} />
                    : (isIConditionDeviceStateTarget(props.comparison.Right)
                        ? <DisplayDeviceTarget target={props.comparison.Right.Target} />
                        : <span>Unknown</span>)
            }
        </Grid>
    </Grid>
);

const DisplayCondition = (props: { condition: ICondition }) => (
    <Grid container>
        {props.condition.Operation &&
            <Grid item>
                {props.condition.Operation?.toString()}
            </Grid>
        }
        {props.condition.Operations.map(op => {
            if (isICondition(op))
                return <DisplayCondition condition={op} />
            else if (isIConditionValueComparison(op))
                return <DisplayConditionValueComparison comparison={op as IConditionValueComparison} />
            else return (<span>Unknown</span>);
        })}
    </Grid>
);

const DisplayDeviceStateValue = (props: { target: IDeviceStateTarget, value: any | undefined }) => (
    <Grid container alignItems="center" spacing={1}>
        <Grid item>
            <DisplayDeviceTarget target={props.target} />
        </Grid>
        <Grid item>
            <span>set</span>
        </Grid>
        <Grid item>
            <DisplayValue value={props.value} />
        </Grid>
    </Grid>
);

const ProcessDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [process, setProcess] = useState<IProcessModel | undefined>();

    const loadDeviceAsync = async () => {
        try {
            if (typeof id !== "object" &&
                typeof id !== 'undefined') {
                const loadedProcess = await ProcessesRepository.getProcessAsync(id);
                setProcess(loadedProcess);
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

    if (error) {
        return <div>Error {error}</div>
    }

    const config = !isLoading ? parseProcessConfiguration(process?.configurationSerialized) : undefined;

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Grid container spacing={2} direction="column" wrap="nowrap">
                <Grid item>
                    <Typography variant="h1">{process?.alias ?? "No name"}</Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <Grid item>
                            <Paper variant="elevation">
                                {isLoading ? <LinearProgress /> : (
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <Typography>Triggers</Typography>
                                            {config && config.triggers?.length
                                                ? config.triggers.map(t => <DisplayDeviceTarget target={t} />)
                                                : <span>No triggers</span>}
                                        </Grid>
                                        <Grid item>
                                            <Typography>Conditions</Typography>
                                            {config?.condition
                                                ? <DisplayCondition condition={config.condition} />
                                                : <span>No condition</span>}
                                        </Grid>
                                        <Grid item>
                                            <Typography>Conducts</Typography>
                                            {config && config.conducts?.length
                                                ? config.conducts.map(c => <DisplayDeviceStateValue target={c.Target} value={c.Value} />)
                                                : <span>No conducts</span>}
                                        </Grid>
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

ProcessDetails.layout = AppLayout;

export default observer(ProcessDetails);