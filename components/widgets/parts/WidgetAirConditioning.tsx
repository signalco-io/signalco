import { Box, ButtonBase, Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import useDevice from '../../../src/hooks/useDevice';
import { CircleSlider } from "react-circle-slider";
import { IWidgetSharedProps } from '../Widget';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { DefaultHeight, DefaultLabel, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import Link from 'next/link';

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'deviceContactTarget' },
    { name: 'targetHeating', label: 'Heating', type: 'deviceContactTarget', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'deviceContactTarget', optional: true },
    DefaultWidth(4),
    DefaultHeight(4)
];

const SmallIndicator = observer((props: { isActive: boolean, icon: string, label: string, activeBackgroundColor: string }) => (
    <Box sx={{ width: '52px', height: '82px', backgroundColor: props.isActive ? props.activeBackgroundColor : 'transparent', borderRadius: 1 }}>
        <Stack alignItems="center" justifyContent="center" height="100%" spacing={1}>
            <Icon sx={{ fontSize: 28, opacity: props.isActive ? 1 : 0.6, }}>{props.icon}</Icon>
            <Typography fontWeight={100} fontSize={12}>{props.label}</Typography>
        </Stack>
    </Box>
));

const WidgetAirConditioning = (props: IWidgetSharedProps) => {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const temperatureDevice = useDevice(config?.targetTemperature?.deviceId);
    const heatingDevice = useDevice(config?.targetHeating?.deviceId);

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
                <Box sx={{ mt: 9 }}>
                    <Link href={`/app/entities/${temperatureDevice?.id}`} passHref>
                        <ButtonBase>
                            <Stack direction="row">
                                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                                    <Typography fontWeight={100} fontSize={64} sx={{ lineHeight: 1 }}>{degreesWhole}</Typography>
                                </Stack>
                                <Stack justifyContent="space-between">
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>&#176;C</Typography>
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>.{degreesDecimal}</Typography>
                                </Stack>
                            </Stack>
                        </ButtonBase>
                    </Link>
                </Box>
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
    );
};

WidgetAirConditioning.columns = 4;
WidgetAirConditioning.rows = 4;

export default observer(WidgetAirConditioning);