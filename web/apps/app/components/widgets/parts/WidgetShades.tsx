import React from 'react';
import dynamic from 'next/dynamic';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Down, Stop, Up } from '@signalco/ui-icons';
import { WidgetSharedProps } from '../Widget';
import { DefaultColumns, DefaultLabel } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { StateAction, executeStateActionsAsync } from './WidgetState';
import { WidgetSpinner } from './piece/WidgetSpinner';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

type ConfigProps = {
    label: string,
    targetUp: StateAction | undefined;
    targetDown: StateAction | undefined;
    targetPosition: Partial<IContactPointer> | undefined;
    stopValueSerialized: string | undefined;
    stopAfter: string | undefined;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { name: 'targetUp', label: 'Up button', type: 'entityContactValue' },
    { name: 'targetDown', label: 'Down button', type: 'entityContactValue' },
    { name: 'targetPosition', label: 'Position', type: 'entityContact', optional: true },
    { name: 'stopValueSerialized', label: 'Stop value', type: 'string' },
    { name: 'stopAfter', label: 'Stop after', type: 'number', dataUnit: 'seconds', optional: true },
    DefaultColumns(4)
];

function WidgetShades({ config, onOptions }: WidgetSharedProps<ConfigProps>) {
    const upEntity = useEntity(config?.targetUp?.entityId);
    const downEntity = useEntity(config?.targetDown?.entityId);
    const positionContact = useContact(config?.targetPosition)

    const isLoading =
        (Boolean(config?.targetUp?.entityId) && (upEntity.isPending || upEntity.isLoading)) ||
        (Boolean(config?.targetDown?.entityId) && (downEntity.isPending || downEntity.isLoading)) ||
        (Boolean(config?.targetPosition) && (positionContact.isPending || positionContact.isLoading));

    const label = config?.label ?? upEntity?.data?.alias ?? downEntity?.data?.alias ?? '';
    const columns = config?.columns ?? 4;
    const stopValueSerialized = config?.stopValueSerialized;

    // Calculate position
    let shadePerc = 0.7;
    if (positionContact.data?.valueSerialized)
        shadePerc = parseFloat(positionContact.data.valueSerialized) / 100;
    if (Number.isNaN(shadePerc))
        shadePerc = 0.7;

    useWidgetOptions(stateOptions, { onOptions });

    const handleStateChangeRequest = (direction: 'up' | 'down' | 'stop') => {
        if (!upEntity || !downEntity) {
            console.warn('State change requested but device is undefined.');
            showNotification('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        const stopActions = (delay = 0) => {
            if (config?.targetUp && config?.targetDown) {
                return [
                    { ...config?.targetUp, valueSerialized: stopValueSerialized, delay },
                    { ...config?.targetDown, valueSerialized: stopValueSerialized, delay },
                ];
            }
            return [];
        }

        const actions: StateAction[] = [];
        const stopAfterDelay = config?.stopAfter ? (Number.parseFloat(config.stopAfter) || 0) * 1000 : 0;
        switch (direction) {
        case 'up':
            if (config?.targetUp)
                actions.push(config?.targetUp)
            break;
        case 'down':
            if (config?.targetDown)
                actions.push(config?.targetDown)
            break;
        default:
        case 'stop':
            // eslint-disable-next-line prefer-spread
            actions.push.apply(actions, stopActions());
            break;
        }

        // Trigger stop if requested in fonfig
        if (direction !== 'stop' && config?.stopAfter) {
            // eslint-disable-next-line prefer-spread
            actions.push.apply(actions, stopActions(stopAfterDelay));
        }

        executeStateActionsAsync(actions);
    };

    return (
        <div className="grid h-full grid-cols-2">
            {columns > 1 && (
                <div className="relative h-full">
                    <Stack
                        className="relative size-full items-start p-2"
                        justifyContent={columns > 2 ? 'space-between' : 'center'}>
                        <div className="relative h-3/4 grow">
                            <WindowVisual shadePerc={1 - shadePerc} size={80} />
                        </div>
                        {columns > 2 && <Typography semiBold noWrap level="body1">{label}</Typography>}
                    </Stack>
                    <Divider orientation="vertical" />
                    <WidgetSpinner isLoading={isLoading} />
                </div>
            )}
            <div className="grow rounded-r-lg border-l">
                <Stack className="h-full">
                    <Button
                        className="grow"
                        variant="plain"
                        onClick={() => handleStateChangeRequest('up')}
                        aria-label="Up"
                        disabled={isLoading}>
                        <Up />
                    </Button>
                    {stopValueSerialized && (
                        <Button
                            className="grow"
                            variant="plain"
                            onClick={() => handleStateChangeRequest('stop')}
                            aria-label="Stop"
                            disabled={isLoading}>
                            <Stop size={18} />
                        </Button>
                    )}
                    <Button
                        className="grow"
                        variant="plain"
                        onClick={() => handleStateChangeRequest('down')}
                        aria-label="Down"
                        disabled={isLoading}>
                        <Down />
                    </Button>
                </Stack>
            </div>
        </div>
    );
}

WidgetShades.columns = 4;

export default WidgetShades;
