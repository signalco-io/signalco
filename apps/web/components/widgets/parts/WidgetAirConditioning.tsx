import React from 'react';
import Link from 'next/link';
import { Icon, Row } from '@signalco/ui';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/joy';
import useContact from 'src/hooks/useContact';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultLabel, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useEntity from '../../../src/hooks/useEntity';

const stateOptions: IWidgetConfigurationOption<any>[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'deviceContactTarget' },
    { name: 'targetHeating', label: 'Heating', type: 'deviceContactTarget', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'deviceContactTarget', optional: true },
    DefaultWidth(4),
    DefaultHeight(4)
];

function SmallIndicator(props: { isActive: boolean; icon: string; label: string; activeBackgroundColor: string; href: string; }) {
    return (
        <Link href={props.href} passHref legacyBehavior>
            <Button variant="plain">
                <Box sx={{ width: '52px', height: '82px', backgroundColor: props.isActive ? props.activeBackgroundColor : 'transparent', borderRadius: 1 }}>
                    <Stack alignItems="center" justifyContent="center" height="100%" spacing={1}>
                        <Icon sx={{ fontSize: 28, opacity: props.isActive ? 1 : 0.6, }}>{props.icon}</Icon>
                        <Typography level="body3">{props.label}</Typography>
                    </Stack>
                </Box>
            </Button>
        </Link>
    );
}

function WidgetAirConditioning(props: WidgetSharedProps<any>) {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const { data: temperatureDevice } = useEntity(config?.targetTemperature?.entityId);
    const { data: heatingDevice } = useEntity(config?.targetHeating?.entityId);

    const temperatureContact = useContact(temperatureDevice ? {
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        entityId: temperatureDevice.id
    } : undefined)?.data;

    const degrees = temperatureContact ? (typeof temperatureContact?.valueSerialized !== 'undefined' ? Number.parseFloat(temperatureContact?.valueSerialized) : undefined) : undefined;
    const degreesWhole = typeof degrees !== 'undefined' ? Math.floor(degrees) : undefined;
    const degreesDecimal = typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined' ? Math.floor((degrees - degreesWhole) * 10) : undefined;

    const heatingContact = useContact(heatingDevice ? {
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        entityId: heatingDevice.id
    } : undefined)?.data;
    const heatingActive = heatingContact?.valueSerialized === 'true';

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                <Box sx={{ mt: 9 }}>
                    <Link href={`/app/entities/${temperatureDevice?.id}`} passHref legacyBehavior>
                        <Button variant="plain">
                            <Row>
                                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                                    <Typography fontWeight={100} fontSize={64} sx={{ lineHeight: 1 }}>{degreesWhole}</Typography>
                                </Stack>
                                <Stack justifyContent="space-between">
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>&#176;C</Typography>
                                    <Typography fontWeight={100} fontSize={18} sx={{ opacity: 0.5 }}>.{degreesDecimal}</Typography>
                                </Stack>
                            </Row>
                        </Button>
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
