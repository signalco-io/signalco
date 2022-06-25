import { Box, Button, Checkbox, FormControlLabel, FormGroup, InputAdornment, OutlinedInput, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ObjectDictAny } from '../../../src/sharedTypes';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import DisplayDeviceTarget from '../../shared/entity/DisplayDeviceTarget';
import SelectItems from '../../shared/form/SelectItems';

interface IWidgetConfigurationDialogProps {
    options: IWidgetConfigurationOption[],
    values: ObjectDictAny,
    setValue: (name: string, value: any) => void,
    onCancel: () => void,
    onSave: (config: object) => void,
}

export interface IWidgetConfigurationProps {
    isOpen: boolean,
    config: object,
    options: IWidgetConfigurationOption[],
    onConfiguration: (config: object) => void,
}

const useWidgetConfiguration = (options: IWidgetConfigurationOption[], config: object | undefined, onConfiguration: (config: any) => void) => {
    const [configurationValues, setConfigurationValues] = useState<ObjectDictAny>(config || {});

    const setValue = (name: string, value: any) => {
        const newValues: ObjectDictAny = {
            ...configurationValues,
        };
        newValues[name] = value;
        setConfigurationValues(newValues);
    };

    const handleCancelConfiguration = () => {
        onConfiguration(config || {});
    };

    const handleSaveConfiguration = () => {
        // Include default values
        options.filter(o => o.default).forEach(defaultOpt => {
            if (Object.keys(configurationValues).indexOf(defaultOpt.name) < 0) {
                configurationValues[defaultOpt.name] = defaultOpt.default;
            }
        })

        // Submit
        onConfiguration(configurationValues);
    }

    return {
        onCancel: handleCancelConfiguration,
        onSave: handleSaveConfiguration,
        options,
        values: configurationValues,
        setValue
    } as IWidgetConfigurationDialogProps;
};

const WidgetConfigurationOption = (props: { option: IWidgetConfigurationOption, value: any, onChange: (value: any) => void }) => {
    if (props.option.type === 'deviceContactTarget') {
        // Handle multi-contact target
        if (props.option.multiple) {
            console.log('options multiple')
            const valueItems = typeof props.value === 'undefined' ? [] : (Array.isArray(props.value) ? props.value : [props.value]);
            const elements = [];
            console.log('multiple value', valueItems)
            for (let i = 0; i <= valueItems.length; i++) {
                const value = valueItems[i];
                console.log('multiple value', value)
                elements.push(<DisplayDeviceTarget key={`option-${i}`} target={value} onChanged={t => {
                    const newValues = [...valueItems];
                    newValues[i] = t;
                    return props.onChange(newValues.filter(i => typeof i !== 'undefined'));
                }} />);
            }

            return <>{elements}</>;
        }

        // Handle single-contact target
        return <DisplayDeviceTarget target={props.value} onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'deviceContactTargetWithValue') {
        return <Stack direction="row" spacing={1}>
            <WidgetConfigurationOption
                option={{ name: 'contact', label: 'Contact', type: 'deviceContactTarget' }}
                value={props.value}
                onChange={(t => {
                    const newValue = { ...props.value, ...t };
                    console.log('new value', newValue);
                    return props.onChange(newValue);
                })} />
            <WidgetConfigurationOption
                option={{ name: 'value', label: 'Value', type: 'string' }}
                value={props.value?.valueSerialized}
                onChange={(t => {
                    return props.onChange({ ...props.value, valueSerialized: t });
                })} />
        </Stack>
    } else if (props.option.type === 'deviceTarget') {
        return <DisplayDeviceTarget target={props.value} hideContact onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'contactTarget') {
        return <DisplayDeviceTarget target={{ ...props.value, deviceId: props.option.data }} hideDevice onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'select') {
        return <SelectItems
            label={props.option.label}
            value={props.value}
            items={props.option.data}
            placeholder={props.option.label}
            fullWidth
            onChange={(item) => item && item.length && props.onChange(item[0])} />
    } else if (props.option.type === 'yesno') {
        return <FormGroup>
            <FormControlLabel
                control={<Checkbox checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />}
                label={props.option.label} />
        </FormGroup>
    } else if (
        props.option.type === 'number' ||
        props.option.type === 'string') {
        return <OutlinedInput
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            endAdornment={props.option.dataUnit && (<InputAdornment position="end">{props.option.dataUnit}</InputAdornment>)} />
    } else if (props.option.type === 'static') {
        return <Typography>{props.value}</Typography>
    }

    return <Typography>{`Unknown option type \"${props.option.type}\"`}</Typography>;
};

const WidgetConfiguration = (props: IWidgetConfigurationProps) => {
    const configProps = useWidgetConfiguration(props.options, props.config, props.onConfiguration)

    return (
        <>
            {props.isOpen && (
                <ConfigurationDialog
                    title="Configure widget"
                    isOpen={props.isOpen}
                    onClose={configProps.onCancel}
                    actions={(
                        <>
                            <Button onClick={configProps.onCancel}>Cancel</Button>
                            <Button autoFocus onClick={configProps.onSave}>Save changes</Button>
                        </>
                    )}>
                    <Stack spacing={2}>
                        {configProps.options.map(opt => {
                            return (
                                <Box key={opt.name}>
                                    <Typography>{opt.label}{opt.optional && ' (optional)'}</Typography>
                                    <WidgetConfigurationOption
                                        option={opt}
                                        value={configProps.values[opt.name] ?? opt.default}
                                        onChange={(value) => configProps.setValue(opt.name, value)} />
                                </Box>
                            );
                        })}
                    </Stack>
                </ConfigurationDialog>
            )}
        </>
    );
};

export default WidgetConfiguration;
