import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import WidgetCard from './WidgetCard';
import { IWidgetSharedProps } from "../Widget";
import { DefaultHeight, DefaultWidth } from "../../../src/widgets/WidgetConfigurationOptions";

const stateOptions = [
    DefaultWidth(2),
    DefaultHeight(1)
];

const WidgetTime = (props: IWidgetSharedProps) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const [time, setTime] = useState('');
    const [seconds, setSeconds] = useState('');

    useEffect(() => {
        const token = setInterval(() => {
            const now = new Date();
            setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
            setSeconds(now.getSeconds().toString().padStart(2, '0'));
        }, 1000);
        return () => clearInterval(token);
    }, []);

    return (
        <WidgetCard
            state={true}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <Box sx={{ height: '100%' }}>
                <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center">
                    <Typography fontSize={36} fontWeight={200} sx={{ margin: 0, padding: 0 }}>{time}</Typography>
                </Stack>
                <Box sx={{ position: 'absolute', top: 19, left: '80%', opacity: 0.4 }}>
                    <Typography>{seconds}</Typography>
                </Box>
            </Box>
        </WidgetCard>
    );
};

export default WidgetTime;