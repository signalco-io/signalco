import React from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { Box, Stack } from '@mui/system';
import { Button } from '@mui/joy';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import useContact from 'src/hooks/useContact';
import IContactPointer from 'src/contacts/IContactPointer';
import { WidgetSharedProps } from '../Widget';
import { DefaultTarget, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';

const stateOptions = [
    DefaultTarget,
    DefaultWidth(1)
];

function WidgetIndicator(props: WidgetSharedProps) {
    const { config } = props;
    const router = useRouter();

    // Calc state from source value
    const pointer = config?.target as IContactPointer;
    const contact = useContact(config?.target);
    const contactValueSerialized = contact?.data?.valueSerialized;
    const value = typeof contactValueSerialized !== 'undefined' ? Number.parseFloat(contactValueSerialized) || 0 : 0;

    const isLow = value < 10;

    const statusColor = isLow ? 'rgba(252, 245, 85, 0.53)' : 'rgba(158, 227, 134, 0.33)';
    const iconColor = isLow ? '#fad63f' : '#a2db79';
    const Icon = isLow ? SentimentDissatisfiedOutlinedIcon : SentimentVerySatisfiedOutlinedIcon;

    const handleSelected = () => {
        router.push(`/app/entities/${pointer.entityId}`)
    }

    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);

    return (
        <Button
            variant="plain"
            sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left' }}
            onClick={handleSelected} >
            <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="flex-end">
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Image src="/assets/widget-images/plant-aloe.png" alt="Plant Aloe" width={76} height={76} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', width: '100%', background: statusColor, borderRadius: '0 0 7px 7px' }}>
                    <Icon fontSize="large" htmlColor={iconColor} />
                </Box>
            </Stack>
        </Button>
    );
}

export default WidgetIndicator;
