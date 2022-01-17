import { ButtonBase, Stack } from "@mui/material";
import { observer } from 'mobx-react-lite';
import React from "react";
import { Box } from '@mui/system';
import Image from 'next/image';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import { useRouter } from "next/router";
import useDevice from "../../../src/hooks/useDevice";
import { IWidgetSharedProps } from "../Widget";
import { DefaultTarget, DefaultWidth } from "../../../src/widgets/WidgetConfigurationOptions";
import useWidgetOptions from "../../../src/hooks/widgets/useWidgetOptions";
import useWidgetActive from "../../../src/hooks/widgets/useWidgetActive";

const stateOptions = [
    DefaultTarget,
    DefaultWidth(1)
];

const WidgetIndicator = (props: IWidgetSharedProps) => {
    const { config } = props;
    const device = useDevice(config?.target?.deviceId);
    const router = useRouter();

    // Calc state from source value
    const contactState = device?.getState({ channelName: config?.target?.channelName, contactName: config?.target?.contactName, deviceId: device.id });
    const value = Number.parseFloat(contactState?.valueSerialized) || 0;

    const isLow = value < 10;

    const statusColor = isLow ? 'rgba(252, 245, 85, 0.53)' : 'rgba(158, 227, 134, 0.33)';
    const iconColor = isLow ? '#fad63f' : "#a2db79";
    const Icon = isLow ? SentimentDissatisfiedOutlinedIcon : SentimentVerySatisfiedOutlinedIcon;

    const handleSelected = () => {
        if (device)
            router.push(`/app/entities/${device.id}`)
    }

    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);

    return (
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
    );
};

export default observer(WidgetIndicator);