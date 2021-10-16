import BatteryCharging20OutlinedIcon from '@mui/icons-material/BatteryCharging20Outlined';
import { Grid, Stack, Typography, Button } from "@mui/material";
import React from "react";
import TvVisual from "../../icons/TvVisual";
import WidgetCard from './WidgetCard';

export const WidgetVacuum = (props: { config?: any }) => {
    const width = 4;
    const height = 4;
    const state = false;
    const label = "Vacuum robot";
    const batteryPerc = 20;

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Stack>
                <Stack>
                    <Typography>{batteryPerc}%</Typography>
                    <BatteryCharging20OutlinedIcon />
                </Stack>
                <TvVisual state={state} theme="dark" size={52} />
                <Typography>{label}</Typography>
            </Stack>
        </WidgetCard>
    );
};

export const WidgetShades = (props: { config: any }) => {
    const width = 4;
    const height = 2;
    const label = "Living room shades";
    const shadePerc = 20;
    const state = shadePerc > 0;

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Grid container>
                <Grid item>
                    <Stack>
                        <TvVisual state={state} theme="dark" size={52} />
                        <Typography>{label}</Typography>
                    </Stack>
                </Grid>
                <Grid item>
                    <Button />
                    <Button />
                    <Button />
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

const WidgetState = (props: { config: any }) => {
    const width = 2;
    const height = 2;
    const state = false;
    const label = "Living room TV"

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Stack sx={{ p: 3 }}>
                <TvVisual state={state} theme="dark" size={52} />
                <Typography fontWeight="light">{label}</Typography>
            </Stack>
        </WidgetCard>
    );
};

export default WidgetState;