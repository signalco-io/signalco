import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SmileMeh, SmileVeryHappy } from '@signalco/ui-icons';
import { Button , Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import { WidgetSharedProps } from '../Widget';
import { DefaultTarget, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import type IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContact from '../../../src/hooks/useContact';
import type IContactPointer from '../../../src/contacts/IContactPointer';

const stateOptions: IWidgetConfigurationOption<any>[] = [
    DefaultTarget,
    DefaultWidth(1)
];

function WidgetIndicator(props: WidgetSharedProps<any>) {
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
    const Icon = isLow ? SmileMeh : SmileVeryHappy;

    const handleSelected = () => {
        router.push(`/app/entities/${pointer.entityId}`)
    }

    useWidgetOptions(stateOptions, props);

    return (
        <Button
            variant="plain"
            sx={{ position: 'relative', height: '100%', width: '100%', display: 'block', textAlign: 'left', margin: 0, padding: 0 }}
            onClick={handleSelected} >
            <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="flex-end">
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Image src="/assets/widget-images/plant-aloe.png" alt="Plant Aloe" width={76} height={76} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px', width: '100%', background: statusColor, borderRadius: '0 0 7px 7px' }}>
                    <Icon fontSize={32} color={iconColor} />
                </Box>
            </Stack>
        </Button>
    );
}

export default WidgetIndicator;
