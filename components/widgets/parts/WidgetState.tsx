import { Stack, Typography, ButtonBase } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React, { useMemo } from "react";
import DevicesRepository from '../../../src/devices/DevicesRepository';
import WidgetCard from './WidgetCard';
import dynamic from 'next/dynamic'
import ConductsService, { IConduct } from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';
import { IWidgetSharedProps } from "../Widget";
import useDevices from "../../../src/hooks/useDevices";
import { IDeviceTarget } from "../../../src/devices/Device";

const stateOptions = [
    { name: 'target', label: 'Target', type: 'deviceContactTarget', multiple: true },
    { name: 'visual', label: 'Visual', type: 'select', default: 'lightbulb', data: [{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }] },
    { name: 'label', label: 'Label', type: 'string', optional: true }
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

const executeConductsAsync = async (conducts: IConduct[]) => {
    // Negate current state
    await ConductsService.RequestMultipleConductAsync(conducts);

    // Set local value state
    for (let index = 0; index < conducts.length; index++) {
        const conduct = conducts[index];
        const device = await DevicesRepository.getDeviceAsync(conduct.target.deviceId);
        device?.updateState(
            conduct.target.channelName,
            conduct.target.contactName,
            conduct.value?.toString(),
            new Date()
        );
    }
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
                PageNotificationService.show("Conduct action new value can't be determined.", "warning");
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
            PageNotificationService.show("Conduct has missing target data.", "warning");
            continue;
        }

        const newValue = await determineActionValueAsync(action);

        conducts.push({ target: action, value: newValue, delay: action.delay ?? 0 });
    }

    await executeConductsAsync(conducts);
};

const WidgetState = (props: IWidgetSharedProps) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const deviceIds = useMemo(() => (config?.target as IDeviceTarget[]).map(i => i.deviceId), [config?.target]);
    const devices = useDevices(deviceIds);

    // Calc state from source value
    // If atleast one contact is true, this widget will set it's state to true
    let state = false;
    if (devices && config?.target) {
        for (let i = 0; i < devices.length; i++) {
            const target = config?.target[i];
            const device = devices[i];
            const contactState = device?.getState({ channelName: target.channelName, contactName: target.contactName, deviceId: device.id });
            if (contactState?.valueSerialized === 'true') {
                state = true;
                break;
            }
        }
    }

    const label = props.config?.label || (typeof devices !== 'undefined' ? devices[0]?.alias : '');
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : LightBulbVisual, [props.config]);

    const handleStateChangeRequest = () => {
        if (typeof devices === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show("Can't execute action, widget is not loaded yet.", "warning");
            return;
        }

        executeStateActionsAsync((config.target as IDeviceTarget[]).map(d => ({
            deviceId: d.deviceId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: state ? 'false' : 'true',
        })));
    };

    return (
        <WidgetCard
            width={2}
            height={2}
            state={state}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <ButtonBase sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleStateChangeRequest} >
                <Stack sx={{ height: '100%', py: 2 }}>
                    <Box sx={{ px: 2.5 }}>
                        <Visual state={state} size={68} />
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