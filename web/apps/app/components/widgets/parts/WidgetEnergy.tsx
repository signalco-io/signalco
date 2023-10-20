import { useMemo } from 'react';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useLoadAndError } from '@signalco/hooks/dist/useLoadAndError';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultColumns, DefaultTargetMultiple, DefaultLabel } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContacts from '../../../src/hooks/signalco/useContacts';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historiesAsync } from '../../../src/contacts/ContactRepository';
import { Wave } from './Wave';

type ConfigProps = {
    label: string | undefined;
    duration: number | undefined;
    target: IContactPointer[];
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { label: 'Duration', name: 'duration', type: 'number', optional: true },
    DefaultTargetMultiple,
    DefaultRows(2),
    DefaultColumns(4)
];

function UsageIndicatorCircle({ value, percentageValue, unit }: { value: number, percentageValue: number, unit: string }) {
    const breakpoints = [10, 30, 60];
    console.log(percentageValue);
    return (
        <div className="relative">
            <div className={cx(
                'relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2',
                percentageValue < breakpoints[0] && 'border-green-200 dark:border-green-500',
                percentageValue >= breakpoints[0] && percentageValue < breakpoints[1] && 'border-lime-200 dark:border-lime-700',
                percentageValue >= breakpoints[1] && percentageValue < breakpoints[2] && 'border-amber-200 dark:border-amber-700',
                percentageValue >= breakpoints[2] && 'border-rose-300 dark:border-rose-900'
            )}>
                <Wave value={percentageValue} breakpoints={breakpoints} />
                <div className="z-10 text-center">
                    <div className="text-2xl text-foreground/90">{value.toFixed(1)}</div>
                    {unit && <Typography level="body3" className="text-foreground/70">{unit}</Typography>}
                </div>
            </div>
        </div>
    );
}

export default function WidgetEnergy({ config, onOptions }: WidgetSharedProps<ConfigProps>) {
    useWidgetOptions(stateOptions, { onOptions });

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 2;
    const duration = config?.duration ?? 24 * 60 * 60 * 1000;

    const contacts = useContacts(config?.target ?? []);
    const usageWats = parseFloat(contacts.at(0)?.data?.valueSerialized ?? 'NaN');

    const loadHistoryCallback = useMemo(() => config?.target ? (() => historiesAsync(config.target, duration)) : undefined, [config?.target, duration]);
    const historyData = useLoadAndError(loadHistoryCallback);

    const label = config?.label ?? '';
    const unit = usageWats > 1000 ? 'kW/h' : 'W/h';
    const usageHumanized = usageWats > 1000 ? usageWats / 1000 : Math.round(usageWats);
    const percentageValue = Math.max(0, Math.min(100, usageHumanized / 6500)) * 100;

    return (
        <Loadable isLoading={historyData.isLoading} loadingLabel="Loading history" error={historyData.error}>
            <div className="absolute inset-0 px-6 py-4">
                <Typography semiBold noWrap>{label}</Typography>
            </div>
            <div className="flex w-full flex-col items-center p-6">
                <UsageIndicatorCircle value={usageHumanized} percentageValue={percentageValue} unit={unit} />
            </div>
            {(historyData.item?.length ?? 0) > 0 && (
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
                        height={rows * 25}
                        hideLegend
                        adaptiveDomain
                    />
                </div>
            )}
        </Loadable>
    );
}
