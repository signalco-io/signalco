import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ConfigurationDialog from "../../shared/dialog/ConfigurationDialog";
import DisplayDeviceTarget from "../../shared/entity/DisplayDeviceTarget";
import SelectItems from "../../shared/form/SelectItems";

export interface IWidgetConfigurationOption {
    name: string,
    label: string,
    type: string,
    default?: any,
    data?: any
}

interface IWidgetConfigurationDialogProps {
    options: IWidgetConfigurationOption[],
    values: { [key: string]: any },
    setValue: (name: string, value: any) => void,
    onClose: () => void,
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
    const [configurationValues, setConfigurationValues] = useState<object>(config || {});

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
        onConfiguration(configurationValues);
    }

    return {
        onClose: handleCancelConfiguration,
        onCancel: handleCancelConfiguration,
        onSave: handleSaveConfiguration,
        options,
        values: configurationValues,
        setValue
    } as IWidgetConfigurationDialogProps;
};

const WidgetConfigurationOption = (props: { option: IWidgetConfigurationOption, value: any, onChange: (value: any) => void }) => {
    if (props.option.type === 'deviceTarget') {
        return <DisplayDeviceTarget target={props.value} onChanged={t => props.onChange(t)} />
    } else if (props.option.type === 'select') {
        return <SelectItems
            value={props.value}
            items={props.option.data}
            placeholder={props.option.label}
            fullWidth
            onChange={(item) => item && item.length && props.onChange(item[0])} />
    }

    return <Typography>Unknown option type</Typography>;
};

const WidgetConfiguration = (props: IWidgetConfigurationProps) => {
    const configProps = useWidgetConfiguration(props.options, props.config, props.onConfiguration)

    return (
        <ConfigurationDialog
            title="Configure widget"
            isOpen={props.isOpen}
            onClose={configProps.onClose}
            actions={(
                <>
                    <Button onClick={configProps.onCancel}>Cancel</Button>
                    <Button autoFocus onClick={configProps.onSave}>Save changes</Button>
                </>
            )}>
            <Stack spacing={2}>
                {configProps.options.map(opt => (
                    <Box key={opt.name}>
                        <Typography>{opt.label}</Typography>
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