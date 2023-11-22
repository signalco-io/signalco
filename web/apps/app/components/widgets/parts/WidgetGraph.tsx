import { useMemo } from 'react';
import { Loadable } from '@signalco/ui/Loadable';
import { usePromise } from '@enterwell/react-hooks';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultColumns, DefaultTargetMultiple, DefaultLabel } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historiesAsync } from '../../../src/contacts/ContactRepository';

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

export default function WidgetGraph({ config, onOptions }: WidgetSharedProps<ConfigProps>) {
    useWidgetOptions(stateOptions, { onOptions });

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 2;
    const duration = config?.duration ?? 0;

    const loadHistoryCallback = useMemo(() => config?.target ? (() => historiesAsync(config.target, duration)) : undefined, [config?.target, duration]);
    const historyData = usePromise(loadHistoryCallback);

    return (
        <Loadable isLoading={historyData.isLoading} loadingLabel="Loading history" error={historyData.error}>
            {(historyData.item?.length ?? 0) > 0 && (
                <Graph
                    isLoading={historyData.isLoading}
                    error={historyData.error}
                    data={historyData.item?.at(0)?.history?.map(i => ({
                        id: i.timeStamp.toUTCString(),
                        value: i.valueSerialized ?? ''
                    })) ?? []}
                    durationMs={duration}
                    width={columns * 80 + 2}
                    height={rows * 80 + 2} />
            )}
        </Loadable>
    );
}
