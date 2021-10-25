import { Stack, Typography, ButtonBase } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { IDeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import WidgetCard from './WidgetCard';
import dynamic from 'next/dynamic'
import ConductsService from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';

const TvVisual = dynamic(() => import("../../icons/TvVisual"));
const LightBulbVisual = dynamic(() => import("../../icons/LightBulbVisual"));

const executeStateAction = async (device: IDeviceModel, channelName: string, contactName: string) => {
    const actions = [];
    actions.push({
        deviceId: device.id,
        channelName: channelName,
        contactName: contactName,
        valueSerialized: undefined,
        delay: 0
    });

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

const WidgetState = (props: { isEditMode: boolean, config: any, setConfig: (config: object) => Promise<void>, onRemove: () => void }) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);

    const width = 2;
    const height = 2;

    // Calc state from source value
    const channelName = config?.target?.channelName;
    const contactName = config?.target?.contactName;
    const contactState = device?.getState({ channelName: channelName, contactName: contactName, deviceId: device.id });
    const state = contactState?.valueSerialized === 'true';

    const label = props.config?.label || device?.alias || '';
    const Visual = props.config?.visual === 'tv' ? TvVisual : LightBulbVisual;

    useEffect(() => {
        (async () => {
            const deviceId = config?.target?.deviceId;
            if (deviceId) {
                setDevice(await DevicesRepository.getDeviceAsync(deviceId));
            }
        })();
    }, [config]);

    const needsConfiguration =
        !config?.target?.channelName ||
        !config?.target?.contactName ||
        !config?.target?.deviceId ||
        !config?.visual;
    const stateOptions = [
        { name: 'target', label: 'Target', type: 'deviceTarget' },
        { name: 'visual', label: 'Visual', type: 'select', default: 'lightbulb', data: [{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }] }
    ];

    const handleStateChangeRequest = () => {
        if (typeof device === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show("Can't execute action, widget is not loaded yet.", "warning");
            return;
        }

        executeStateAction(device, channelName, contactName);
    };

    return (
        <WidgetCard
            width={width}
            height={height}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <ButtonBase sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left' }} onClick={handleStateChangeRequest} >
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