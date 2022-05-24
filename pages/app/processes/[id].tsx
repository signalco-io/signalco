import { Alert, Box, ButtonBase, Chip, Collapse, Container, Grid, IconButton, Menu, MenuItem, Paper, Popover, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import { observer } from 'mobx-react-lite';
import ProcessesRepository from '../../../src/processes/ProcessesRepository';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { makeAutoObservable, runInAction } from 'mobx';
import { EntityContactAccess, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import DisplayDeviceTarget from '../../../components/shared/entity/DisplayDeviceTarget';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';
import EntityRepository from '../../../src/entity/EntityRepository';
import { TransitionGroup } from 'react-transition-group';
import useLocale, { useLocalePlaceholders } from '../../../src/hooks/useLocale';
import { useLoadAndError } from '../../../src/hooks/useLoadingAndError';
import EditableInput from '../../../components/shared/form/EditableInput';
import PageNotificationService from '../../../src/notifications/PageNotificationService';

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
    const config = JSON.parse(configJson ?? '{}');

    const configMapped = makeAutoObservable({
        triggers: (config.triggers?.filter((t: unknown) => t) ?? []) as IDeviceTargetIncomplete[],
        condition: (config.condition ?? { operations: [] }) as Condition,
        conducts: (config.conducts?.filter((c: unknown) => c) ?? []) as IConduct[]
    });

    return configMapped;
}

const DisplayValue = observer((props: { value: any | undefined, dataType: string, onChanged: (value: any | undefined) => void }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [dataType, setDataType] = useState(props.dataType);
    const [value, setValue] = useState<string>(props.value || '');
    const { t } = useLocalePlaceholders();

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
        label = props.value?.toString() || t('Unknown');
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

const ProcessItem = (props: { children: React.ReactNode, in?: boolean }) => (
    <Collapse in={props.in} sx={{ pb: 1 }}>
        <Paper sx={{ p: 2, width: '100%' }} variant="elevation" elevation={0}>
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
        if (process.item) {
            return await parseProcessConfigurationAsync(process.item.configurationSerialized)
        }
    }, [process.item]);
    const processConfig = useLoadAndError(loadProcessConfig);

    const persistProcessAsync = async () => {
        if (!process.item || !processConfig.item) {
            console.error('Can not persist null process or config.');
            return;
        }

        await ProcessesRepository.saveProcessConfigurationAsync(process.item?.id, JSON.stringify(processConfig.item));
    };

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        if (processConfig.item)
            processConfig.item.condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (index: number, updated?: IDeviceTargetState) => {
        // TODO: Use action to change state
        runInAction(() => {
            if (processConfig.item) {
                processConfig.item.conducts[index].value = updated?.value;
                processConfig.item.conducts[index].target = updated?.target;
            }

            persistProcessAsync();
        });
    };

    const handleAddConduct = () => {
        runInAction(() => {
            if (processConfig.item) {
                processConfig.item.conducts.push(new Conduct());
            }
        });
    };

    const handleAddCondition = () => {
        if (processConfig.item) {
            const condition = processConfig.item.condition;
            if (condition) {
                const c = new Condition();
                c.operation = '=';
                c.operations.push({ left: undefined, right: { value: true } });
                condition.operations.push(c);
            }
        }
    }

    const handleDelete = async () => {
        if (process.item) {
            await EntityRepository.deleteAsync(process.item.id, 2);
            router.push('/app/processes');
        }
    }

    const handleRename = async (newAlias: string) => {
        if (process.item) {
            process.item.alias = newAlias;
            try {
                await ProcessesRepository.saveProcessAsync(process.item);
            } catch (err) {
                console.error('Process rename failed', err);
                PageNotificationService.show(t('FailedToSave'), 'error');
            }
        }
    }

    return (
        <>
            {process.error && <Alert severity="error">{process.error}</Alert>}
            <Container sx={{ pt: { xs: 0, sm: 4 } }} maxWidth="md">
                <Stack spacing={2}>
                    <Stack spacing={2}>
                        <EditableInput
                            sx={{
                                fontWeight: 300,
                                fontSize: { xs: 18, sm: 24 }
                            }}
                            text={process.item?.alias || ''}
                            noWrap
                            onChange={handleRename} />
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
                            <ProcessSection header={t('Conditions')} isLoading={processConfig.isLoading} onAdd={handleAddCondition} addTitle={t('AddCondition')} />
                            {processConfig.isLoading ? <><DisplayItemPlaceholder /><DisplayItemPlaceholder /><DisplayItemPlaceholder /></> :
                                (processConfig.item?.condition
                                    ? (<ProcessItem in>
                                        <DisplayCondition isTopLevel condition={processConfig.item.condition} onChanged={handleConditionChange} />
                                    </ProcessItem>
                                    ) : (
                                        <NoDataPlaceholder content={t('NoConductions')} />
                                    )
                                )}
                        </Stack>
                        <Stack spacing={1}>
                            <ProcessSection header={t('Conducts')} isLoading={processConfig.isLoading} onAdd={handleAddConduct} addTitle={t('AddConduct')} />
                            <TransitionGroup>
                                {processConfig.item?.conducts?.map((c, i) =>
                                    <ProcessItem key={`value${i}`} in>
                                        <DisplayDeviceTarget
                                            target={c.target}
                                            value={c.value}
                                            contactAccessFilter={EntityContactAccess.Write.value}
                                            onChanged={(target, value) => handleValueChanged(i, { target, value })}
                                            selectContact
                                            selectValue />
                                    </ProcessItem>
                                )}
                            </TransitionGroup>
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
