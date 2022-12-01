import React from 'react';
import { Stack, Typography } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

const stateOptions: IWidgetConfigurationOption<any>[] = [
    DefaultLabel,
    DefaultColumns(4),
    DefaultRows(4),
];

function WidgetVacuum(props: WidgetSharedProps<any>) {
    const label = props.config?.label ?? '';
    const batteryPerc = 100;

    useWidgetOptions(stateOptions, props);

    return (
        <Stack>
            <Stack>
                <Typography>{batteryPerc}%</Typography>
            </Stack>
            <Typography>{label}</Typography>
        </Stack>
    );
}

export default WidgetVacuum;
