import { useMemo } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Droplets, Flame, Snowflake } from '@signalco/ui-icons';
import { usePromise } from '@enterwell/react-hooks';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { KnownPages } from '../../../src/knownPages';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historiesAsync } from '../../../src/contacts/ContactRepository';
import { SmallIndicator } from './piece/SmallIndicator';
import { PrimaryValueLabel, numberWholeAndDecimal } from './piece/PrimaryValueLabel';

type ConfigProps = {
    label?: string;
    targetTemperature: IContactPointer | undefined;
    targetHumidity: IContactPointer | undefined;
    targetHeating: IContactPointer | undefined;
    targetCooling: IContactPointer | undefined;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'entityContact', optional: true },
    { name: 'targetHumidity', label: 'Humidity', type: 'entityContact', optional: true },
    { name: 'targetHeating', label: 'Heating', type: 'entityContact', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'entityContact', optional: true },
    DefaultColumns(4),
    DefaultRows(4)
];

function WidgetAirConditioning(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const { data: temperatureDevice } = useEntity(config?.targetTemperature?.entityId);
    const { data: heatingDevice } = useEntity(config?.targetHeating?.entityId);
    const { data: coolingDevice } = useEntity(config?.targetCooling?.entityId);

    const { data: temperatureContact } = useContact(temperatureDevice && config?.targetTemperature);
    const { data: humidityContact } = useContact(temperatureDevice && config?.targetHumidity);

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 4;

    const [humidityWhole] = numberWholeAndDecimal(humidityContact?.valueSerialized);

    const heatingContact = useContact(heatingDevice && config?.targetHeating ? {
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        entityId: heatingDevice.id
    } : undefined)?.data;
    const heatingActive = heatingContact?.valueSerialized === 'true';

    const duration = 24 * 60 * 60 * 1000;
    const loadHistoryCallback = useMemo(() =>
        temperatureContact
            ? (() => historiesAsync([temperatureContact], duration))
            : undefined, [temperatureContact, duration]);
    const historyData = usePromise(loadHistoryCallback);

    return (
        <div className="size-full">
            <Stack alignItems="center" justifyContent="center" className="h-full">
                <Button variant="plain" href={`${KnownPages.Entities}/${temperatureDevice?.id}`}>
                    <PrimaryValueLabel
                        value={temperatureContact?.valueSerialized}
                        unit={'\u00B0C'}
                        size={rows > 2 ? 'large' : 'small'} />
                </Button>
                {config?.label && (
                    <Typography
                        thin={rows > 1}
                        className={cx(rows > 1 ? 'text-base' : 'text-xs')}
                        tertiary>
                        {config.label}
                    </Typography>
                )}
                {rows > 1 && (
                    <Row spacing={rows < 4 ? 0 : 1}
                        style={{
                            marginTop: rows > 2 ? (rows < 4 ? 0 : 4 * 8) : 8,
                            flexDirection: rows < 4 ? 'column' : 'row',
                            position: rows < 4 ? 'absolute' : 'unset',
                            right: rows < 4 ? 0 : undefined,
                            top: rows < 4 ? 0 : undefined
                        }}
                        alignItems="stretch">
                        {humidityContact && (
                            <SmallIndicator
                                small={rows < 4}
                                isActive={false}
                                label={`${humidityWhole}%`}
                                icon={<Droplets />}
                                href={`${KnownPages.Entities}/${humidityContact?.entityId}`}
                                activeBackgroundColor={'#445D79'} />
                        )}
                        {config?.targetCooling &&
                            <SmallIndicator small={rows < 4} isActive={false} label="Cooling" icon={<Snowflake />} activeBackgroundColor="#445D79" href={`${KnownPages.Entities}/${coolingDevice?.id}`} />
                        }
                        {config?.targetHeating &&
                            <SmallIndicator small={rows < 4} isActive={heatingActive} label="Heating" icon={<Flame />} activeBackgroundColor="#A14D4D" href={`${KnownPages.Entities}/${heatingDevice?.id}`} />
                        }
                    </Row>
                )}
            </Stack>
            <div className="absolute inset-x-0 bottom-0">
                <Graph
                    isLoading={historyData.isLoading}
                    error={historyData.error}
                    data={historyData.item?.at(0)?.history?.map(i => ({
                        id: i.timeStamp.toUTCString(),
                        value: i.valueSerialized ?? ''
                    })) ?? []}
                    durationMs={duration}
                    width={columns * 84 - 2}
                    height={rows * 25 - 2}
                    hideLegend
                    adaptiveDomain
                    aggregate={30 * 60 * 1000}
                />
            </div>
        </div>
    );
}

WidgetAirConditioning.columns = 4;
WidgetAirConditioning.rows = 4;

export default WidgetAirConditioning;
