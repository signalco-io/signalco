import { Grid, Stack, Typography } from '@mui/material';
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
        { name: 'columns', label: 'Width', type: 'static', default: 4 },
        { name: 'rows', label: 'Height', type: 'static', default: 4 }
    ];

    const temperatureContact = temperatureDevice?.getState({
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        deviceId: temperatureDevice.id
    });

    const degrees = temperatureContact?.valueSerialized;

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
                    <Stack sx={{ height: '100%' }} justifyContent="center">
                        <Typography fontWeight={100} fontSize={64}>{degrees}</Typography>
                    </Stack>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

WidgetTermostat.columns = 4;
WidgetTermostat.rows = 4;

export default WidgetTermostat;