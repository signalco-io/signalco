import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

type ConfigProps = {
    label?: string;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    DefaultColumns(4),
    DefaultRows(4),
];

function WidgetVacuum(props: WidgetSharedProps<ConfigProps>) {
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
