import React from 'react';
import { Stack, Typography } from '@mui/material';
import { BatteryCharging20Outlined } from '@mui/icons-material';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultLabel, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    DefaultWidth(4),
    DefaultHeight(4),
];

function WidgetVacuum(props: WidgetSharedProps) {
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
}

export default WidgetVacuum;
