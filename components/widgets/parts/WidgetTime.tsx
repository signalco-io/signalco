import { Box, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { IWidgetSharedProps } from "../Widget";
import { DefaultHeight, DefaultWidth } from "../../../src/widgets/WidgetConfigurationOptions";
import useWidgetOptions from "../../../src/hooks/widgets/useWidgetOptions";
import useWidgetActive from "../../../src/hooks/widgets/useWidgetActive";

const stateOptions = [
    { label: 'Show seconds', name: 'showSeconds', type: 'yesno', default: false, optional: true },
    DefaultWidth(2),
    DefaultHeight(1)
];

const WidgetTime = (props: IWidgetSharedProps) => {
    const { config } = props;
    const [time, setTime] = useState('');
    const [seconds, setSeconds] = useState('');

    const showSeconds = config?.showSeconds ?? false;

    const updateTime = useCallback(() => {
        const now = new Date();
        setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        setSeconds(now.getSeconds().toString().padStart(2, '0'));
    }, []);

    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);
    useEffect(() => {
        const token = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(token);
    }, [updateTime]);

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
};

export default WidgetTime;
