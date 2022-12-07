import { useCallback } from 'react';
import { Loadable } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultColumns, DefaultTargetMultiple } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useLoadAndError from '../../../src/hooks/useLoadAndError';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historyAsync } from '../../../src/contacts/ContactRepository';

type ConfigProps = {
    label: string | undefined;
    duration: number | undefined;
    target: IContactPointer[];
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    { label: 'Label', name: 'label', type: 'string', optional: true },
    { label: 'Duration', name: 'duration', type: 'number', optional: true },
    DefaultTargetMultiple,
    DefaultRows(2),
    DefaultColumns(4)
];

const loadHistory = async (targets: IContactPointer[] | undefined, duration: number) => {
    var contactsHistory = targets?.map(async t => ({ contact: t, history: await historyAsync(t, duration) }));
    if (contactsHistory) {
        return await Promise.all(contactsHistory);
    }
    return [];
};

export default function WidgetButton({ config, onOptions }: WidgetSharedProps<ConfigProps>) {
    useWidgetOptions(stateOptions, { onOptions });

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 2;
    const duration = config?.duration ?? 0;

    const loadHistoryCallback = useCallback(() => loadHistory(config?.target, duration), [config?.target, duration]);
    const historyData = useLoadAndError(loadHistoryCallback);

    return (
        <Loadable isLoading={historyData.isLoading} error={historyData.error}>
            {(historyData.item?.length ?? 0) > 0 && (
                <Graph data={historyData.item![0]?.history?.map(i => ({
                    id: i.timeStamp.toUTCString(),
                    value: i.valueSerialized ?? ''
                }))} durationMs={duration} width={columns * 80 + 2} height={rows * 80 + 2} />
            )}
        </Loadable>
    );
}
