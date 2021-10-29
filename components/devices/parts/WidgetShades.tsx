import { ArrowUpward, Stop, ArrowDownward } from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import WidgetCard from './WidgetCard';
import { IWidgetConfigurationOption } from './WidgetConfiguration';
import { executeStateAction } from './WidgetState';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

const WidgetShades = (props: { config: any, isEditMode: boolean, setConfig: (config: object) => void, onRemove: () => void }) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);

    const label = props.config?.label || device?.alias || '';

    useEffect(() => {
        (async () => {
            const deviceId = config?.target?.deviceId;
            if (deviceId) {
                setDevice(await DevicesRepository.getDeviceAsync(deviceId));
            }
        })();
    }, [config]);

    const width = (config as any)?.columns || 2;
    const height = (config as any)?.rows || 2;

    // TODO: Calc from source value
    const shadePerc = 0.3;
    const state = shadePerc < 1;

    const needsConfiguration =
        !config?.target?.deviceId ||
        !config?.targetContactUp?.deviceId ||
        !config?.targetContactUp?.contactName ||
        !config?.targetContactUp?.channelName ||
        !config?.targetContactDown?.deviceId ||
        !config?.targetContactDown?.contactName ||
        !config?.targetContactDown?.channelName;
    const stateOptions: IWidgetConfigurationOption[] = [
        { name: 'target', label: 'Target', type: 'deviceTarget' },
        { name: 'targetContactUp', label: 'Up button', type: 'contactTarget', data: device?.id },
        { name: 'targetContactDown', label: 'Down button', type: 'contactTarget', data: device?.id },
        { name: 'columns', label: 'Width', type: 'static', default: 4 }
    ];

    const handleStateChangeRequest = (direction: "up" | "down" | "stop") => {
        if (typeof device === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show("Can't execute action, widget is not loaded yet.", "warning");
            return;
        }

        switch (direction) {
            case "up":
                executeStateAction(device, config?.targetContactUp?.channelName, config?.targetContactUp?.contactName, 'true');
                break;
            case "down":
                executeStateAction(device, config?.targetContactDown?.channelName, config?.targetContactDown?.contactName, 'true');
                break;
            default:
            case "stop":
                executeStateAction(device, config?.targetContactDown?.channelName, config?.targetContactDown?.contactName, 'false');
                executeStateAction(device, config?.targetContactUp?.channelName, config?.targetContactUp?.contactName, 'false');
                break;
        }
    };

    return (
        <WidgetCard
            width={width}
            height={height}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onRemove={onRemove}
            onConfigured={setConfig}
            options={stateOptions}
            config={config}>
            <Grid container wrap="nowrap" sx={{ height: '100%' }}>
                <Grid item xs={6}>
                    <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                        <WindowVisual shadePerc={shadePerc} theme="dark" size={68} />
                        <Typography fontWeight="light">{label}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ background: '#121212', borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                    <Stack sx={{ height: '100%' }} justifyContent="stretch">
                        <Button onClick={() => handleStateChangeRequest('up')} sx={{ flexGrow: 1, borderBottom: '1px solid rgba(255,255,255,0.12)' }}><ArrowUpward /></Button>
                        <Button onClick={() => handleStateChangeRequest('stop')} sx={{ flexGrow: 1 }}><Stop /></Button>
                        <Button onClick={() => handleStateChangeRequest('down')} sx={{ flexGrow: 1, borderTop: '1px solid rgba(255,255,255,0.12)' }}><ArrowDownward /></Button>
                    </Stack>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

WidgetShades.columns = 4;

export default WidgetShades;