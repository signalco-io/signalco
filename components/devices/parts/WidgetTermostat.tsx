import { Box, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import WidgetCard from './WidgetCard';
import { IWidgetConfigurationOption } from './WidgetConfiguration';

const WidgetTermostat = (props: { config: any, isEditMode: boolean, setConfig: (config: object) => void, onRemove: () => void }) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const [temperatureDevice, setTemperatureDevice] = useState<IDeviceModel | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const deviceId = config?.targetTemperature?.deviceId;
            if (deviceId) {
                setTemperatureDevice(await DevicesRepository.getDeviceAsync(deviceId));
            }
        })();
    }, [config]);

    const width = (config as any)?.columns || 4;
    const height = (config as any)?.rows || 4;

    // TODO: Calc from heating/cooling contact states
    const state = false;

    const needsConfiguration =
        !config?.targetTemperature?.deviceId ||
        !config?.targetTemperature?.contactName ||
        !config?.targetTemperature?.channelName;
    const stateOptions: IWidgetConfigurationOption[] = [
        { name: 'targetTemperature', label: 'Temperature', type: 'deviceContactTarget' },
        { name: 'label', label: 'Label', type: 'string' },
        { name: 'columns', label: 'Width', type: 'static', default: 4 },
        { name: 'rows', label: 'Height', type: 'static', default: 4 }
    ];

    const temperatureContact = temperatureDevice?.getState({
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        deviceId: temperatureDevice.id
    });

    const degrees = temperatureContact ? Number.parseFloat(temperatureContact?.valueSerialized) : undefined;
    const degreesWhole = typeof degrees !== 'undefined' ? Math.floor(degrees) : undefined;
    const degreesDecimal = typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined' ? Math.floor((degrees - degreesWhole) * 10) : undefined;

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
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Stack alignItems="center" justifyContent="center">
                            <Stack direction="row" sx={{ height: '100%' }}>
                                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                                    <Typography fontWeight={100} fontSize={64}>{degreesWhole}</Typography>
                                </Stack>
                                <Stack justifyContent="space-between" sx={{ my: 2, pl: 1 }}>
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>&#176;C</Typography>
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>.{degreesDecimal}</Typography>
                                </Stack>
                            </Stack>
                            <Typography sx={{ opacity: 0.5 }}>{config.label}</Typography>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

WidgetTermostat.columns = 4;
WidgetTermostat.rows = 4;

export default WidgetTermostat;