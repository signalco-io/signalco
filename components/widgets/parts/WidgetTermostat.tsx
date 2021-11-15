import { Box, Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import useDevice from '../../../src/hooks/useDevice';
import WidgetCard from './WidgetCard';
import { CircleSlider } from "react-circle-slider";
import { IWidgetSharedProps } from '../Widget';

const stateOptions = [
    { name: 'targetTemperature', label: 'Temperature', type: 'deviceContactTarget' },
    { name: 'label', label: 'Label', type: 'string' },
    { name: 'targetHeating', label: 'Heating', type: 'deviceContactTarget' },
    { name: 'columns', label: 'Width', type: 'static', default: 4 },
    { name: 'rows', label: 'Height', type: 'static', default: 4 }
];

const SmallIndicator = observer((props: { isActive: boolean, icon: string, label: string, activeBackgroundColor: string }) => (
    <Box sx={{ width: '52px', height: '82px', backgroundColor: props.isActive ? props.activeBackgroundColor : 'transparent', borderRadius: 1 }}>
        <Stack alignItems="center" justifyContent="center" height="100%" spacing={1}>
            <Icon sx={{ fontSize: 28, opacity: props.isActive ? 1 : 0.6, }}>{props.icon}</Icon>
            <Typography fontWeight={100} fontSize={12}>{props.label}</Typography>
        </Stack>
    </Box>
));

const WidgetTermostat = (props: IWidgetSharedProps) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const temperatureDevice = useDevice(config?.targetTemperature?.deviceId);
    const heatingDevice = useDevice(config?.targetHeating?.deviceId);

    const width = (config as any)?.columns || 4;
    const height = (config as any)?.rows || 4;

    // TODO: Calc from heating/cooling contact states
    const state = false;

    const needsConfiguration =
        !config?.targetTemperature?.deviceId ||
        !config?.targetTemperature?.contactName ||
        !config?.targetTemperature?.channelName;

    const temperatureContact = temperatureDevice?.getState({
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        deviceId: temperatureDevice.id
    });

    const degrees = temperatureContact ? Number.parseFloat(temperatureContact?.valueSerialized) : undefined;
    const degreesWhole = typeof degrees !== 'undefined' ? Math.floor(degrees) : undefined;
    const degreesDecimal = typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined' ? Math.floor((degrees - degreesWhole) * 10) : undefined;

    const heatingContact = heatingDevice?.getState({
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        deviceId: heatingDevice.id
    });
    const heatingActive = heatingContact?.valueSerialized === 'true';

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
            <Box sx={{ width: '100%', height: '100%' }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    <Box sx={{ height: '111px', overflow: 'hidden', position: 'absolute', top: '24px' }}>
                        <CircleSlider
                            value={degrees}
                            size={222}
                            stepSize={0.1}
                            min={10}
                            max={34}
                            shadow={false}
                            knobRadius={15}
                            progressWidth={4}
                            circleWidth={15}
                            circleColor="#666"
                            progressColor={heatingActive ? "#DC5151" : 'transparent'}
                            onChange={() => { }}
                        />
                    </Box>
                    <Stack direction="row" sx={{ mt: 9 }}>
                        <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                            <Typography fontWeight={100} fontSize={64} sx={{ lineHeight: 1 }}>{degreesWhole}</Typography>
                        </Stack>
                        <Stack justifyContent="space-between">
                            <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>&#176;C</Typography>
                            <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>.{degreesDecimal}</Typography>
                        </Stack>
                    </Stack>
                    <Typography fontWeight="light" sx={{ opacity: 0.5 }}>{config.label}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        {config.targetCooling &&
                            <SmallIndicator isActive={false} label="Cooling" icon="ac_unit" activeBackgroundColor="#445D79" />
                        }
                        {config.targetHeating &&
                            <SmallIndicator isActive={heatingActive} label="Heating" icon="whatshot" activeBackgroundColor="#A14D4D" />
                        }
                    </Stack>
                </Stack>
            </Box>
        </WidgetCard >
    );
};

WidgetTermostat.columns = 4;
WidgetTermostat.rows = 4;

export default observer(WidgetTermostat);