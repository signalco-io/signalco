import { Box, ButtonBase, Icon, Stack, Typography } from '@mui/material';
import React from 'react';
import useEntity from '../../../src/hooks/useEntity';
import { CircleSlider } from 'react-circle-slider';
import { WidgetSharedProps } from '../Widget';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { DefaultHeight, DefaultLabel, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import Link from 'next/link';
import useContact from 'src/hooks/useContact';

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'deviceContactTarget' },
    { name: 'targetHeating', label: 'Heating', type: 'deviceContactTarget', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'deviceContactTarget', optional: true },
    DefaultWidth(4),
    DefaultHeight(4)
];

function SmallIndicator(props: { isActive: boolean; icon: string; label: string; activeBackgroundColor: string; href: string; }) {
    return (
        <Link href={props.href} passHref>
            <ButtonBase>
                <Box sx={{ width: '52px', height: '82px', backgroundColor: props.isActive ? props.activeBackgroundColor : 'transparent', borderRadius: 1 }}>
                    <Stack alignItems="center" justifyContent="center" height="100%" spacing={1}>
                        <Icon sx={{ fontSize: 28, opacity: props.isActive ? 1 : 0.6, }}>{props.icon}</Icon>
                        <Typography fontWeight={100} fontSize={12}>{props.label}</Typography>
                    </Stack>
                </Box>
            </ButtonBase>
        </Link>
    );
}

function WidgetAirConditioning(props: WidgetSharedProps) {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const { item: temperatureDevice } = useEntity(config?.targetTemperature?.deviceId);
    const { item: heatingDevice } = useEntity(config?.targetHeating?.deviceId);

    const temperatureContact = useContact(temperatureDevice ? {
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        entityId: temperatureDevice.id
    } : undefined)?.item;

    const degrees = temperatureContact ? (typeof temperatureContact?.valueSerialized !== 'undefined' ? Number.parseFloat(temperatureContact?.valueSerialized) : undefined) : undefined;
    const degreesWhole = typeof degrees !== 'undefined' ? Math.floor(degrees) : undefined;
    const degreesDecimal = typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined' ? Math.floor((degrees - degreesWhole) * 10) : undefined;

    const heatingContact = useContact(heatingDevice ? {
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        entityId: heatingDevice.id
    } : undefined)?.item;
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
                        progressColor={heatingActive ? '#DC5151' : 'transparent'}
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
                    {/* {config.targetCooling &&
                        <SmallIndicator isActive={false} label="Cooling" icon="ac_unit" activeBackgroundColor="#445D79" />
                    } */}
                    {config.targetHeating &&
                        <SmallIndicator isActive={heatingActive} label="Heating" icon="whatshot" activeBackgroundColor="#A14D4D" href={`/app/entities/${heatingDevice?.id}`} />
                    }
                </Stack>
            </Stack>
        </Box>
    );
}

WidgetAirConditioning.columns = 4;
WidgetAirConditioning.rows = 4;

export default WidgetAirConditioning;
