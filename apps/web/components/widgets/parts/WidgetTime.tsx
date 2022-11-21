import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from '@signalco/ui';
import { Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import IWidgetConfigurationOption from 'src/widgets/IWidgetConfigurationOption';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import DateTimeProvider from '../../../src/services/DateTimeProvider';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useInterval from '../../../src/hooks/useInterval';

const stateOptions: IWidgetConfigurationOption<any>[] = [
    { label: 'Show seconds', name: 'showSeconds', type: 'yesno', default: false, optional: true },
    DefaultWidth(2),
    DefaultHeight(1)
];

function WidgetTime(props: WidgetSharedProps<any>) {
    const { config } = props;
    const [time, setTime] = useState('');
    const [seconds, setSeconds] = useState('');

    const showSeconds = config?.showSeconds ?? false;

    const updateTime = useCallback(() => {
        const now = DateTimeProvider.now();
        setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        setSeconds(now.getSeconds().toString().padStart(2, '0'));
    }, []);

    useWidgetOptions(stateOptions, props);
    useInterval(updateTime, 1000);
    useEffect(() => updateTime(), [updateTime]);

    return (
        <Box sx={{ height: '100%' }}>
            <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center">
                <Typography fontSize={36} fontWeight={200} sx={{ margin: 0, padding: 0 }}>{time}</Typography>
            </Stack>
            {showSeconds && (
                <Box sx={{ position: 'absolute', top: 19, left: '80%', opacity: 0.4 }}>
                    <Typography>{seconds}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default WidgetTime;
