import { ArrowUpward, Stop, ArrowDownward } from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import useEntity from '../../../src/hooks/useEntity';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import { WidgetSharedProps } from '../Widget';
import { executeStateActionsAsync, StateAction } from './WidgetState';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

const WidgetShades = (props: WidgetSharedProps) => {
    const { config } = props;
    const entity = useEntity(config?.target?.entityId);
    const entityId = entity.item?.id;

    const label = props.config?.label || entity?.item?.alias || '';

    // TODO: Calc from source value
    const shadePerc = 0.3;

    // TODO: Move outside of component
    const stateOptions: IWidgetConfigurationOption[] = useMemo(() => [
        { name: 'target', label: 'Target', type: 'deviceTarget' },
        { name: 'targetContactUp', label: 'Up button', type: 'contactTarget', data: entityId },
        { name: 'targetContactDown', label: 'Down button', type: 'contactTarget', data: entityId },
        { name: 'stopAfter', label: 'Stop after', type: 'number', dataUnit: 'seconds', data: entityId, optional: true },
        DefaultWidth(4)
    ], [entityId]);

    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);

    const handleStateChangeRequest = (direction: 'up' | 'down' | 'stop') => {
        if (typeof entityId === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        const stopActions = (delay: number = 0) => {
            return [
                { entityId: entityId, channelName: config?.targetContactDown?.channelName, contactName: config?.targetContactDown?.contactName, valueSerialized: 'false', delay },
                { entityId: entityId, channelName: config?.targetContactUp?.channelName, contactName: config?.targetContactUp?.contactName, valueSerialized: 'false', delay },
            ];
        }

        const actions: StateAction[] = [];
        const stopAfterDelay = config.stopAfter ? (Number.parseFloat(config.stopAfter) || 0) * 1000 : 0;
        switch (direction) {
            case 'up':
                actions.push({
                    entityId: entityId,
                    channelName: config?.targetContactUp?.channelName,
                    contactName: config?.targetContactUp?.contactName,
                    valueSerialized: 'true'
                })
                break;
            case 'down':
                actions.push({
                    entityId: entityId,
                    channelName: config?.targetContactDown?.channelName,
                    contactName: config?.targetContactDown?.contactName,
                    valueSerialized: 'true'
                })
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
            <Grid item xs={6}>
                <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                    <WindowVisual shadePerc={shadePerc} size={68} />
                    <Typography fontWeight="light" noWrap>{label}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={6} sx={{ flexGrow: 1, bgcolor: 'background.paper', borderLeft: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Stack sx={{ height: '100%' }} justifyContent="stretch">
                    <Button onClick={() => handleStateChangeRequest('up')} sx={{ flexGrow: 1, borderBottom: '1px solid', borderColor: 'divider' }}><ArrowUpward /></Button>
                    <Button onClick={() => handleStateChangeRequest('stop')} sx={{ flexGrow: 1 }}><Stop /></Button>
                    <Button onClick={() => handleStateChangeRequest('down')} sx={{ flexGrow: 1, borderTop: '1px solid', borderColor: 'divider' }}><ArrowDownward /></Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

WidgetShades.columns = 4;

export default WidgetShades;
