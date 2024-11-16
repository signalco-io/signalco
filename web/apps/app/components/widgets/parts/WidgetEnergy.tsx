import { useMemo } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { cx } from '@signalco/ui-primitives/cx';
import { Loadable } from '@signalco/ui/Loadable';
import { usePromise } from '@enterwell/react-hooks';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultColumns, DefaultTargetMultiple, DefaultLabel } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContacts from '../../../src/hooks/signalco/useContacts';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historiesAsync } from '../../../src/contacts/ContactRepository';
import { Wave } from './Wave';
import { PrimaryValueLabel } from './piece/PrimaryValueLabel';

type ConfigProps = {
    label: string | undefined;
    duration: number | undefined;
    maxUsage: number | undefined;
    target: IContactPointer[];
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { label: 'Duration', name: 'duration', type: 'number', optional: true },
    { label: 'Maximal usage', name: 'maxUsage', type: 'number', optional: true },
    DefaultTargetMultiple,
    DefaultRows(2),
    DefaultColumns(4)
];

function UsageIndicatorCircle({ value, percentageValue, unit, largeValue, size, fullSize }: {
    value: number,
    percentageValue: number,
    unit: string,
    largeValue?: boolean,
    size?: 'small' | 'normal' | 'large',
    fullSize?: boolean
}) {
    const breakpoints = [10, 30, 60] as const;
    return (
        <div className={cx('relative', fullSize && 'size-full')}>
            <div className={cx(
                'relative flex items-center justify-center overflow-hidden',
                !fullSize ? 'rounded-full border-2' : 'w-full h-full',
                (!fullSize && (!size || size === 'normal')) && 'h-32 w-32',
                (!fullSize && size === 'small') && 'h-16 w-16',
                (!fullSize && size === 'large') && 'h-44 w-44',
                percentageValue < breakpoints[0] && 'border-green-200 dark:border-green-500',
                percentageValue >= breakpoints[0] && percentageValue < breakpoints[1] && 'border-lime-200 dark:border-lime-700',
                percentageValue >= breakpoints[1] && percentageValue < breakpoints[2] && 'border-amber-200 dark:border-amber-700',
                percentageValue >= breakpoints[2] && 'border-rose-300 dark:border-rose-900'
            )}>
                <Wave value={percentageValue} breakpoints={breakpoints} />
                <div className={cx('z-10 text-center', largeValue && 'ml-6')}>
                    <PrimaryValueLabel value={value} unit={unit} size={size ?? 'normal'} />
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
    const maxUsage = config?.maxUsage ?? 6500;

    const contacts = useContacts(config?.target ?? []);
    const isLoading = contacts.filter(c => c.isLoading).length > 0;
    const errors = contacts.filter(c => c.error).map(c => c.error).join('\n');

    const usageWats = contacts.length > 0 ? parseFloat(contacts.at(0)?.data?.valueSerialized ?? 'NaN') : NaN;

    const loadHistoryCallback = useMemo(() => config?.target ? (() => historiesAsync(config.target, duration)) : undefined, [config?.target, duration]);
    const historyData = usePromise(loadHistoryCallback);

    const label = config?.label ?? '';
    const isLargeValue = usageWats >= 1000;
    const unit = isLargeValue ? 'kW/h' : 'W/h';
    const usageHumanized = isLargeValue ? usageWats / 1000 : Math.round(usageWats);
    const percentageValue = Math.max(0, Math.min(100, usageWats / maxUsage)) * 100;

    const isSmall = rows <= 2 || columns <= 2;
    const isTiny = rows <= 1 || columns <= 1;
    const indicatorSize = rows > 3 && columns > 3 ? 'large' : (!isSmall ? 'normal' : 'small');

    return (
        <Loadable
            contentVisible
            isLoading={isLoading}
            loadingLabel="Loading"
            error={errors}
            className="items-end">
            {!isTiny && (
                <div className="absolute inset-0 p-2">
                    <Typography semiBold noWrap level="body1">{label}</Typography>
                </div>
            )}
            <div className={cx(
                'w-full h-full',
                !isTiny && 'flex flex-col pb-3 justify-center items-center',
            )}>
                <UsageIndicatorCircle
                    value={usageHumanized}
                    percentageValue={percentageValue}
                    unit={unit}
                    largeValue={isLargeValue}
                    size={indicatorSize}
                    fullSize={isTiny} />
            </div>
            {!isTiny && (
                <Loadable
                    contentVisible
                    isLoading={historyData.isLoading}
                    loadingLabel="Loading"
                    error={historyData.error}
                    className="absolute inset-x-0 bottom-0">
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
                            aggregate={60 * 60 * 1000}
                        />
                    </div>
                </Loadable>
            )}
        </Loadable>
    );
}
