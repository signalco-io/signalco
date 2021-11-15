import { Box, Button, InputAdornment, OutlinedInput, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ConfigurationDialog from "../../shared/dialog/ConfigurationDialog";
import DisplayDeviceTarget from "../../shared/entity/DisplayDeviceTarget";
import SelectItems from "../../shared/form/SelectItems";

export interface IWidgetConfigurationOption {
    name: string,
    label: string,
    type: string,
    default?: any,
    dataUnit?: string,
    data?: any,
    optional?: boolean
}

interface IWidgetConfigurationDialogProps {
    options: IWidgetConfigurationOption[],
    values: { [key: string]: any },
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
    const [configurationValues, setConfigurationValues] = useState<{ [key: string]: any }>(config || {});

    const setValue = (name: string, value: any) => {
        const newValues: { [key: string]: any } = {
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
        return <DisplayDeviceTarget target={props.value} onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'deviceTarget') {
        return <DisplayDeviceTarget target={props.value} hideContact onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'contactTarget') {
        return <DisplayDeviceTarget target={{ ...props.value, deviceId: props.option.data }} hideDevice onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'select') {
        return <SelectItems
            value={props.value}
            items={props.option.data}
            placeholder={props.option.label}
            fullWidth
            onChange={(item) => item && item.length && props.onChange(item[0])} />
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

    return <Typography>Unknown option type</Typography>;
};

const WidgetConfiguration = (props: IWidgetConfigurationProps) => {
    const configProps = useWidgetConfiguration(props.options, props.config, props.onConfiguration)

    return (
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
                {configProps.options.map(opt => (
                    <Box key={opt.name}>
                        <Typography>{opt.label}{opt.optional && " (optional)"}</Typography>
                        <WidgetConfigurationOption
                            option={opt}
                            value={configProps.values[opt.name] || opt.default}
                            onChange={(value) => configProps.setValue(opt.name, value)} />
                    </Box>
                ))}
            </Stack>
        </ConfigurationDialog>
    );
};

export default WidgetConfiguration;