import { Stack, Typography, ButtonBase } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React, { useMemo } from "react";
import DevicesRepository from '../../../src/devices/DevicesRepository';
import WidgetCard from './WidgetCard';
import dynamic from 'next/dynamic'
import ConductsService from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';
import useDevice from "../../../src/hooks/useDevice";
import { IWidgetSharedProps } from "../Widget";

const stateOptions = [
    { name: 'target', label: 'Target', type: 'deviceContactTarget' },
    { name: 'visual', label: 'Visual', type: 'select', default: 'lightbulb', data: [{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }] }
];

const TvVisual = dynamic(() => import("../../icons/TvVisual"));
const LightBulbVisual = dynamic(() => import("../../icons/LightBulbVisual"));

export type StateAction = {
    deviceId: string,
    channelName: string,
    contactName: string,
    valueSerialized?: string,
    delay?: number
};

export const executeStateActionAsync = (deviceId: string, channelName: string, contactName: string, valueSerialized?: string, delay?: number) => {
    return executeStateActionsAsync([{
        deviceId: deviceId,
        channelName: channelName,
        contactName: contactName,
        valueSerialized: valueSerialized,
        delay: delay
    }]);
}

export const executeStateActionsAsync = async (actions: StateAction[]) => {
    // Execute all actions
    const conducts = [];
    for (const action of actions) {
        if (typeof action.deviceId === 'undefined' ||
            typeof action.channelName === 'undefined' ||
            typeof action.contactName === 'undefined') {
            console.warn('Invalid button action source', action)
            return;
        }

        const device = await DevicesRepository.getDeviceAsync(action.deviceId)

        const isAction = device
            ?.getContact({ channelName: action.channelName, deviceId: device.id, contactName: action.contactName })
            ?.dataType === 'action' ?? false;

        // Retrieve current boolean state
        let newState = null;
        if (typeof action.valueSerialized === 'undefined') {
            if (!isAction) {
                const currentState = device?.getState(action);
                if (typeof currentState === 'undefined') {
                    console.warn('Failed to retrieve button action source state', action)
                    return;
                }

                newState = typeof currentState === 'undefined'
                    ? action.valueSerialized
                    : !(`${currentState.valueSerialized}`.toLowerCase() === 'true');
            }
        } else {
            newState = action.valueSerialized;
        }

        conducts.push({ target: action, value: newState, delay: action.delay ?? 0, device: device });
    }

    // Negate current state
    await ConductsService.RequestMultipleConductAsync(conducts);

    // Set local value state
    conducts.forEach(conduct => {
        conduct.device?.updateState(
            conduct.target.channelName,
            conduct.target.contactName,
            conduct.value?.toString(),
            new Date()
        );
    });
};

const WidgetState = (props: IWidgetSharedProps) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const device = useDevice(config?.target?.deviceId);

    // Calc state from source value
    const contactState = device?.getState({ channelName: config?.target?.channelName, contactName: config?.target?.contactName, deviceId: device.id });
    const state = contactState?.valueSerialized === 'true';

    const label = props.config?.label || device?.alias || '';
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : LightBulbVisual, [props.config]);

    const needsConfiguration =
        !config?.target?.channelName ||
        !config?.target?.contactName ||
        !config?.target?.deviceId ||
        !config?.visual;

    const handleStateChangeRequest = () => {
        if (typeof device === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show("Can't execute action, widget is not loaded yet.", "warning");
            return;
        }

        executeStateActionAsync(device.id, config?.target?.channelName, config?.target?.contactName);
    };

    return (
        <WidgetCard
            width={2}
            height={2}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <ButtonBase sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleStateChangeRequest} >
                <Stack sx={{ height: '100%', py: 2 }}>
                    <Box sx={{ px: 2.5 }}>
                        <Visual state={state} theme="dark" size={68} />
                    </Box>
                    <Box sx={{ px: 2.5 }}>
                        <Typography fontWeight="light" noWrap>{label}</Typography>
                    </Box>
                </Stack>
            </ButtonBase>
        </WidgetCard>
    );
};

export default observer(WidgetState);