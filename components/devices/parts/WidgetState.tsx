import { ArrowDownward, ArrowUpward, Stop } from '@mui/icons-material';
import BatteryCharging20OutlinedIcon from '@mui/icons-material/BatteryCharging20Outlined';
import { Grid, Stack, Typography, Button, ButtonBase } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import LightBulbVisual from '../../icons/LightBulbVisual';
import TvVisual from "../../icons/TvVisual";
import WindowVisual from '../../icons/WindowVisual';
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
    const label = props.config?.label || '';

    // TODO: Calc from source value
    const shadePerc = 1;

    const state = shadePerc < 1;

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Grid container wrap="nowrap" sx={{ height: '100%' }}>
                <Grid item xs={6}>
                    <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                        <WindowVisual shadePerc={shadePerc} theme="dark" size={68} />
                        <Typography fontWeight="light">{label}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ background: '#121212', borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                    <Stack sx={{ height: '100%' }} justifyContent="stretch">
                        <Button sx={{ flexGrow: 1, borderBottom: '1px solid rgba(255,255,255,0.12)' }}><ArrowUpward /></Button>
                        <Button sx={{ flexGrow: 1 }}><Stop /></Button>
                        <Button sx={{ flexGrow: 1, borderTop: '1px solid rgba(255,255,255,0.12)' }}><ArrowDownward /></Button>
                    </Stack>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

const WidgetState = (props: { config: any }) => {
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);

    const width = 2;
    const height = 2;

    // Calc state from source value
    const contactState = device?.getState({ channelName: 'philipshue', contactName: 'on', deviceId: device.id });
    const state = contactState?.valueSerialized === 'true';

    useEffect(() => {
        (async () => {
            setDevice(await DevicesRepository.getDeviceAsync('f9983f10-4a69-4f5a-b113-32b541e3c536'));
        })();
    }, []);

    const label = props.config?.label || device?.alias || '';
    const Visual = props.config?.visual === 'tv' ? TvVisual : LightBulbVisual;

    return (
        <WidgetCard width={width} height={height} state={state}>
            <ButtonBase sx={{ height: '100%', width: '100%', justifyContent: 'flex-start' }} >
                <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-evenly">
                    <Visual state={state} theme="dark" size={68} />
                    <Typography sx={{ display: 'flex' }} fontWeight="light">{label}</Typography>
                </Stack>
            </ButtonBase>
        </WidgetCard>
    );
};

export default observer(WidgetState);