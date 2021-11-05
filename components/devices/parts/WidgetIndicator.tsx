import { ButtonBase, Stack } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React from "react";
import WidgetCard from './WidgetCard';
import { Box } from '@mui/system';
import Image from 'next/image';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import { useRouter } from "next/router";
import useDevice from "../../../src/hooks/useDevice";

const WidgetIndicator = (props: { isEditMode: boolean, config: any, setConfig: (config: object) => void, onRemove: () => void }) => {
    const { config, setConfig, isEditMode, onRemove } = props;
    const device = useDevice(config?.target?.deviceId);
    const router = useRouter();

    // Calc state from source value
    const contactState = device?.getState({ channelName: config?.target?.channelName, contactName: config?.target?.contactName, deviceId: device.id });
    const value = Number.parseFloat(contactState?.valueSerialized) || 0;

    const isLow = value < 10;

    const statusColor = isLow ? 'rgba(252, 245, 85, 0.53)' : 'rgba(158, 227, 134, 0.33)';
    const iconColor = isLow ? '#fad63f' : "#a2db79";
    const Icon = isLow ? SentimentDissatisfiedOutlinedIcon : SentimentVerySatisfiedOutlinedIcon;

    const needsConfiguration =
        !config?.target?.channelName ||
        !config?.target?.contactName ||
        !config?.target?.deviceId;
    const stateOptions = [
        { name: 'target', label: 'Target', type: 'deviceContactTarget' },
        { name: 'columns', label: 'Width', type: 'static', default: 1 }
    ];

    const handleSelected = () => {
        if (device)
            router.push(`/app/devices/${device.id}`)
    }

    return (
        <WidgetCard
            width={1}
            height={2}
            state={true}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <ButtonBase sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleSelected} >
                <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="flex-end">
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Image src="/assets/widget-images/plant-aloe.png" alt="Plant Aloe" width={76} height={76} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', width: '100%', background: statusColor, borderRadius: '0 0 7px 7px' }}>
                        <Icon fontSize="large" htmlColor={iconColor} />
                    </Box>
                </Stack>
            </ButtonBase>
        </WidgetCard>
    );
};

export default observer(WidgetIndicator);