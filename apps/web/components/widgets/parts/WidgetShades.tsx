import React from 'react';
import dynamic from 'next/dynamic';
import { Down, Stop, Up } from '@signalco/ui-icons';
import Grid from '@mui/system/Unstable_Grid';
import { Stack } from '@mui/system';
import { Button, Divider, Typography } from '@mui/joy';
import { StateAction, executeStateActionsAsync } from './WidgetState';
import { WidgetSharedProps } from '../Widget';
import { DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { showNotification } from '../../../src/notifications/PageNotificationService';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useEntity from '../../../src/hooks/useEntity';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

const stateOptions: IWidgetConfigurationOption<any>[] = [
    { name: 'targetUp', label: 'Up button', type: 'deviceContactTargetWithValue' },
    { name: 'targetDown', label: 'Down button', type: 'deviceContactTargetWithValue' },
    { name: 'stopValueSerialized', label: 'Stop value', type: 'string' },
    { name: 'stopAfter', label: 'Stop after', type: 'number', dataUnit: 'seconds', optional: true },
    DefaultWidth(4)
];

function WidgetShades(props: WidgetSharedProps<any>) {
    const { config } = props;
    const upEntity = useEntity(config?.targetUp?.entityId);
    const downEntity = useEntity(config?.targetDown?.entityId);

    const label = props.config?.label ?? upEntity?.data?.alias ?? downEntity?.data?.alias ?? '';

    // TODO: Calc from source value
    const shadePerc = 0.3;
    const stopValueSerialized = config?.stopValueSerialized;

    useWidgetOptions(stateOptions, props);

    const handleStateChangeRequest = (direction: 'up' | 'down' | 'stop') => {
        if (!upEntity || !downEntity) {
            console.warn('State change requested but device is undefined.');
            showNotification('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        const stopActions = (delay: number = 0) => {
            return [
                { ...config?.targetUp, valueSerialized: stopValueSerialized, delay },
                { ...config?.targetDown, valueSerialized: stopValueSerialized, delay },
            ];
        }

        const actions: StateAction[] = [];
        const stopAfterDelay = config.stopAfter ? (Number.parseFloat(config.stopAfter) || 0) * 1000 : 0;
        switch (direction) {
            case 'up':
                actions.push(config?.targetUp)
                break;
            case 'down':
                actions.push(config?.targetDown)
                break;
            default:
            case 'stop':
                actions.push.apply(actions, stopActions());
                break;
        }

        // Trigger stop if requested in fonfig
        if (direction !== 'stop' && config.stopAfter) {
            actions.push.apply(actions, stopActions(stopAfterDelay));
        }

        executeStateActionsAsync(actions);
    };

    return (
        <Grid container wrap="nowrap" sx={{ height: '100%' }}>
            <Grid xs={6}>
                <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                    <WindowVisual shadePerc={shadePerc} size={68} />
                    <Typography fontWeight="500" noWrap>{label}</Typography>
                </Stack>
            </Grid>
            <Divider orientation="vertical" />
            <Grid xs={6} sx={{ flexGrow: 1, borderColor: 'divider', borderRadius: '0 8px 8px 0' }}>
                <Stack sx={{ height: '100%' }} justifyContent="stretch">
                    <Button variant="outlined" onClick={() => handleStateChangeRequest('up')} sx={{ borderRadius: '0 8px 0 0', flexGrow: 1, border: 0 }}><Up /></Button>
                    <Button variant="outlined" onClick={() => handleStateChangeRequest('stop')} sx={{ borderRadius: 0, flexGrow: 1, border: 0 }}><Stop size={18} /></Button>
                    <Button variant="outlined" onClick={() => handleStateChangeRequest('down')} sx={{ borderRadius: '0 0 8px 0', flexGrow: 1, border: 0 }}><Down /></Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

WidgetShades.columns = 4;

export default WidgetShades;
