import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { useInterval } from '@signalco/hooks/useInterval';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import type IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { now } from '../../../src/services/DateTimeProvider';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

type ConfigProps = {
    showSeconds?: boolean;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    { label: 'Show seconds', name: 'showSeconds', type: 'yesno', default: false, optional: true },
    DefaultColumns(2),
    DefaultRows(1)
];

function WidgetTime(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    const [time, setTime] = useState('');
    const [seconds, setSeconds] = useState('');

    const showSeconds = config?.showSeconds ?? false;

    const updateTime = useCallback(() => {
        const nowTime = now();
        setTime(`${nowTime.getHours().toString().padStart(2, '0')}:${nowTime.getMinutes().toString().padStart(2, '0')}`);
        setSeconds(nowTime.getSeconds().toString().padStart(2, '0'));
    }, []);

    useWidgetOptions(stateOptions, props);
    useInterval(updateTime, 1000);
    useEffect(() => updateTime(), [updateTime]);

    return (
        <div style={{ height: '100%' }}>
            <Stack style={{ height: '100%' }} alignItems="center" justifyContent="center">
                <div style={{ position: 'relative', margin: 0, padding: 0 }}>
                    <Typography level="h2" thin>
                        {time}
                        {showSeconds && (
                            <span style={{ position: 'absolute', opacity: 0.4, bottom: -20, right: 0 }}>
                                <Typography level="h6">{seconds}</Typography>
                            </span>
                        )}
                    </Typography>
                </div>
            </Stack>
        </div>
    );
}

export default WidgetTime;
