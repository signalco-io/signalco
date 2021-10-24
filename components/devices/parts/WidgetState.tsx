import { ArrowDownward, ArrowUpward, Stop } from '@mui/icons-material';
import BatteryCharging20OutlinedIcon from '@mui/icons-material/BatteryCharging20Outlined';
import { Grid, Stack, Typography, Button, ButtonBase, Dialog, DialogActions, DialogContent, Select } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from "react";
import { IDeviceModel, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import WidgetCard from './WidgetCard';
import dynamic from 'next/dynamic'
import DisplayDeviceTarget from '../../shared/entity/DisplayDeviceTarget';
import SelectItems from '../../shared/form/SelectItems';
import ConductsService from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';

export const WidgetVacuum = (/*props: { config?: any }*/) => {
    const width = 4;
    const height = 4;
    const state = false;
    const label = "Vacuum robot";
    const batteryPerc = 20;

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Stack>
                <Stack>
                    <Typography>{batteryPerc}%</Typography>
                    <BatteryCharging20OutlinedIcon />
                </Stack>

                <Typography>{label}</Typography>
            </Stack>
        </WidgetCard>
    );
};

export const WidgetShades = (props: { config: any }) => {
    const width = 4;
    const height = 2;
    const label = props.config?.label || '';

    // TODO: Calc from source value
    const shadePerc = 0.3;

    const state = shadePerc < 1;

    const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

    return (
        <WidgetCard width={width} height={height} state={state}>
            <Grid container wrap="nowrap" sx={{ height: '100%' }}>
                <Grid item xs={6}>
                    <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                        <WindowVisual shadePerc={shadePerc} theme="dark" size={68} />
                        <Typography fontWeight="light">{label}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ background: '#121212', borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                    <Stack sx={{ height: '100%' }} justifyContent="stretch">
                        <Button sx={{ flexGrow: 1, borderBottom: '1px solid rgba(255,255,255,0.12)' }}><ArrowUpward /></Button>
                        <Button sx={{ flexGrow: 1 }}><Stop /></Button>
                        <Button sx={{ flexGrow: 1, borderTop: '1px solid rgba(255,255,255,0.12)' }}><ArrowDownward /></Button>
                    </Stack>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

const TvVisual = dynamic(() => import("../../icons/TvVisual"));
const LightBulbVisual = dynamic(() => import("../../icons/LightBulbVisual"));

const useWidgetConfiguration = () => {
    const [target, setTarget] = useState<IDeviceTargetIncomplete | undefined>();
    const [visual, setVisual] = useState<string>('lightbulb');
    const [isConfigureOpen, setIsConfigureOpen] = useState(false);
    const handleOpenConfiguration = () => {
        setIsConfigureOpen(true);
    };

    const handleCancelConfiguration = () => {
        setTarget(config?.target);
        setIsConfigureOpen(false);
    };

    const handleSaveConfiguration = () => {
        setConfig({ target: target, visual: visual })
        setIsConfigureOpen(false);
    }

    return {

    };
};

const WidgetConfiguration = () => {
    return (
        <Dialog open={isConfigureOpen} onClose={() => setIsConfigureOpen(false)}>
            <DialogContent>
                <div>
                    <div>Target</div>
                    <DisplayDeviceTarget target={target} onChanged={t => setTarget(t)} />
                    <SelectItems
                        value={[visual]}
                        items={[{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }]}
                        onChange={(item) => item && item.length && setVisual(item[0])} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelConfiguration}>Cancel</Button>
                <Button autoFocus onClick={handleSaveConfiguration}>Save changes</Button>
            </DialogActions>
        </Dialog>
    );
};

const WidgetState = (props: { config: any, setConfig: (config: object) => Promise<void> }) => {
    const { config, setConfig } = props;
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);

    const needsConfiguration =
        !config?.target?.channelName ||
        !config?.target?.contactName ||
        !config?.target?.deviceId ||
        !config?.visual;

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

    const handleStateChangeRequest = async () => {
        if (typeof device === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show("Can't execute action, widget is not loaded yet.", "warning");
            return;
        }

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

    return (
        <>
            <WidgetCard width={width} height={height} state={state} needsConfiguration={needsConfiguration} onConfigure={handleOpenConfiguration}>
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

        </>
    );
};

export default observer(WidgetState);