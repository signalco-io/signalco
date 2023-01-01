import React, { useCallback } from 'react';
import Link from 'next/link';
import { Stack, Icon, Row, Button, Typography, Box } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { KnownPages } from '../../../src/knownPages';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useEntity from '../../../src/hooks/signalco/useEntity';
import useContact from '../../../src/hooks/signalco/useContact';
import IContact from '../../../src/contacts/IContact';
import Graph from '../../graphs/Graph';
import useLoadAndError from '../../../src/hooks/useLoadAndError';
import { historiesAsync } from '../../../src/contacts/ContactRepository';

type ConfigProps = {
    label: string;
    targetTemperature: IContact | undefined;
    targetHeating: IContact | undefined;
    targetCooling: IContact | undefined;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'entityContact', optional: true },
    { name: 'targetHeating', label: 'Heating', type: 'entityContact', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'entityContact', optional: true },
    DefaultColumns(4),
    DefaultRows(4)
];

interface SmallIndicatorProps {
    isActive: boolean;
    icon: string;
    label: string;
    activeBackgroundColor: string;
    href: string;
    small?: boolean | undefined;
}

function SmallIndicator({
    isActive,
    icon,
    label,
    activeBackgroundColor,
    href,
    small = true
}: SmallIndicatorProps) {
    return (
        <Link href={href} passHref>
            <Button variant="plain">
                <Box sx={{
                    width: small ? 24 : 52,
                    height: small ? 30 : 82,
                    backgroundColor: isActive ? activeBackgroundColor : 'transparent', borderRadius: 1
                }}>
                    <Stack alignItems="center" justifyContent="center" style={{ height: '100%' }} spacing={1}>
                        <Icon sx={{ fontSize: 28, opacity: isActive ? 1 : 0.3, }}>{icon}</Icon>
                        {!small && <Typography level="body3">{label}</Typography>}
                    </Stack>
                </Box>
            </Button>
        </Link>
    );
}

function WidgetAirConditioning(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const { data: temperatureDevice } = useEntity(config?.targetTemperature?.entityId);
    const { data: heatingDevice } = useEntity(config?.targetHeating?.entityId);
    const { data: coolingDevice } = useEntity(config?.targetCooling?.entityId);

    const temperatureContact = useContact(temperatureDevice && config?.targetTemperature ? {
        channelName: config?.targetTemperature?.channelName,
        contactName: config?.targetTemperature?.contactName,
        entityId: temperatureDevice.id
    } : undefined)?.data;

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 4;
    const degrees = temperatureContact
        ? (typeof temperatureContact?.valueSerialized !== 'undefined'
            ? Number.parseFloat(temperatureContact?.valueSerialized)
            : undefined)
        : undefined;
    const degreesWhole = typeof degrees !== 'undefined'
        ? Math.floor(degrees)
        : undefined;
    const degreesDecimal = typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined'
        ? Math.floor((degrees - degreesWhole) * 10)
        : undefined;

    const heatingContact = useContact(heatingDevice && config?.targetHeating ? {
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        entityId: heatingDevice.id
    } : undefined)?.data;
    const heatingActive = heatingContact?.valueSerialized === 'true';

    const duration = 24 * 60 * 60 * 1000;
    const loadHistoryCallback = useCallback(() => historiesAsync(temperatureContact ? [temperatureContact] : [], duration), [temperatureContact, duration]);
    const historyData = useLoadAndError(loadHistoryCallback);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Stack alignItems="center" justifyContent="center" style={{ height: '100%' }}>
                <Link href={`${KnownPages.Entities}/${temperatureDevice?.id}`} passHref>
                    <Button variant="plain">
                        <Row alignItems="stretch">
                            <Stack style={{ height: '100%' }} justifyContent="center" alignItems="center">
                                <Typography fontWeight={100} fontSize={rows > 2 ? 64 : 42} lineHeight={1}>{degreesWhole}</Typography>
                            </Stack>
                            <Stack justifyContent="space-between">
                                <Typography fontWeight={100} fontSize={rows > 2 ? 18 : 12} sx={{ opacity: 0.6 }}>&#176;C</Typography>
                                <Typography fontWeight={100} fontSize={rows > 2 ? 18 : 14} sx={{ opacity: 0.6 }}>.{degreesDecimal}</Typography>
                            </Stack>
                        </Row>
                    </Button>
                </Link>
                {config?.label && (
                    <Typography
                        fontWeight={rows > 1 ? 'light' : 'normal'}
                        fontSize={rows > 1 ? '1rem' : '0.7rem'}
                        sx={{ opacity: 0.5 }}>
                        {config.label}
                    </Typography>
                )}
                {rows > 2 && (
                    <Row spacing={2} style={{ marginTop: rows > 2 ? 4 * 8 : 8 }}>
                        {config?.targetCooling &&
                            <SmallIndicator small={rows < 4} isActive={false} label="Cooling" icon="ac_unit" activeBackgroundColor="#445D79" href={`${KnownPages.Entities}/${coolingDevice?.id}`} />
                        }
                        {config?.targetHeating &&
                            <SmallIndicator small={rows < 4} isActive={heatingActive} label="Heating" icon="whatshot" activeBackgroundColor="#A14D4D" href={`${KnownPages.Entities}/${heatingDevice?.id}`} />
                        }
                    </Row>
                )}
            </Stack>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <Graph
                    data={historyData.item?.at(0)?.history?.map(i => ({
                        id: i.timeStamp.toUTCString(),
                        value: i.valueSerialized ?? ''
                    })) ?? []} durationMs={duration}
                    width={columns * 84 - 2}
                    height={rows * 25}
                    hideLegend
                    adaptiveDomain
                />
            </div>
        </Box>
    );
}

WidgetAirConditioning.columns = 4;
WidgetAirConditioning.rows = 4;

export default WidgetAirConditioning;
