import { BatteryCharging20Outlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { DefaultHeight, DefaultLabel, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import { IWidgetSharedProps } from '../Widget';

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    DefaultWidth(4),
    DefaultHeight(4),
];

const WidgetVacuum = (props: IWidgetSharedProps) => {
    const label = props.config?.label ?? '';
    const batteryPerc = 100;

    useWidgetOptions(stateOptions, props);

    return (
        <Stack>
            <Stack>
                <Typography>{batteryPerc}%</Typography>
                <BatteryCharging20Outlined />
            </Stack>
            <Typography>{label}</Typography>
        </Stack>
    );
};

export default WidgetVacuum;