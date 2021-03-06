import { Stack, Typography, ButtonBase, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import dynamic from 'next/dynamic'
import ConductsService from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';
import { WidgetSharedProps } from '../Widget';
import useDevices from '../../../src/hooks/useDevices';
import { IDeviceTarget } from '../../../src/devices/Device';
import { DefaultLabel, DefaultTargetMultiple } from '../../../src/widgets/WidgetConfigurationOptions';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';

const stateOptions = [
    DefaultLabel,
    DefaultTargetMultiple,
    { name: 'visual', label: 'Visual', type: 'select', default: 'lightbulb', data: [{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }] },
];

const TvVisual = dynamic(() => import('../../icons/TvVisual'));
const LightBulbVisual = dynamic(() => import('../../icons/LightBulbVisual'));

export type StateAction = {
    deviceId: string,
    channelName: string,
    contactName: string,
    valueSerialized?: string,
    delay?: number
};

const determineActionValueAsync = async (action: StateAction) => {
    if (typeof action.valueSerialized === 'undefined') {
        // Retrieve device and determine whether contact is action contact
        const device = await DevicesRepository.getDeviceAsync(action.deviceId);
        const isAction = device
            ?.getContact({ channelName: action.channelName, deviceId: device.id, contactName: action.contactName })
            ?.dataType === 'action' ?? false;

        if (!isAction) {
            const currentState = device?.getState(action);
            if (typeof currentState === 'undefined') {
                console.warn('Failed to retrieve button action source state', action)
                PageNotificationService.show('Conduct action new value can\'t be determined.', 'warning');
                return null;
            }

            // TODO: Only use boolean resolved when contact is boolean
            // Set negated boolean value
            return !(`${currentState.valueSerialized}`.toLowerCase() === 'true');
        }
    } else {
        return action.valueSerialized;
    }
};

export const executeStateActionsAsync = async (actions: StateAction[]) => {
    const conducts = [];
    for (const action of actions) {
        if (typeof action.deviceId === 'undefined' ||
            typeof action.channelName === 'undefined' ||
            typeof action.contactName === 'undefined') {
            console.warn('Action has invalid target', action)
            PageNotificationService.show('Conduct has missing target data.', 'warning');
            continue;
        }

        const newValue = await determineActionValueAsync(action);

        conducts.push({ target: action, value: newValue, delay: action.delay ?? 0 });
    }

    await ConductsService.RequestMultipleConductAsync(conducts);
};

const WidgetState = (props: WidgetSharedProps) => {
    const { config } = props;
    const deviceIds = useMemo(() => (Array.isArray(config?.target) ? config.target as IDeviceTarget[] : undefined)?.map(i => i.deviceId), [config?.target]);
    const devices = useDevices(deviceIds);
    const [isLoading, setIsLoading] = useState(true);

    // Calc state from source value
    // If atleast one contact is true, this widget will set it's state to true
    let state = false;
    if (devices) {
        for (let i = 0; i < devices.length; i++) {
            const target = config.target[i];
            const device = devices[i];

            if (typeof target === 'undefined' ||
                typeof device === 'undefined')
                continue;

            const contactState = device?.getState({ channelName: target.channelName, contactName: target.contactName, deviceId: device.id });
            if (contactState?.valueSerialized === 'true') {
                state = true;
                break;
            }
        }

        if (isLoading)
            setIsLoading(false);
    }

    const label = props.config?.label || (typeof devices !== 'undefined' ? devices[0]?.alias : '');
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : LightBulbVisual, [props.config]);

    const handleStateChangeRequest = () => {
        if (typeof devices === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        executeStateActionsAsync((config.target as IDeviceTarget[]).map(d => ({
            deviceId: d.deviceId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: state ? 'false' : 'true',
        })));
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);
    useWidgetActive(state, props);

    return (
        <ButtonBase sx={{ position: 'relative', height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleStateChangeRequest} >
            <Stack sx={{ height: '100%', py: 2 }}>
                <Box sx={{ px: 2 }}>
                    <Visual state={state} size={68} />
                </Box>
                <Box sx={{ px: 2 }}>
                    <Typography fontWeight="light" noWrap>{label}</Typography>
                </Box>
            </Stack>
            {isLoading && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </ButtonBase>
    );
};

export default observer(WidgetState);
