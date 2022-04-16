import { ButtonBase, Icon, Stack } from '@mui/material';
import { IDeviceTargetWithValueFallback } from '../../../src/devices/Device';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { DefaultHeight, DefaultTargetWithValue, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import { IWidgetSharedProps } from '../Widget';
import { executeStateActionsAsync } from './WidgetState';

const stateOptions: IWidgetConfigurationOption[] = [
    { label: 'Icon', name: 'icon', type: 'string', optional: true },
    DefaultTargetWithValue,
    DefaultHeight(1),
    DefaultWidth(1)
];

export default function WidgetButton(props: IWidgetSharedProps) {
    const { config } = props;

    const icon = config?.icon ?? 'adjust';

    const handleActionRequest = () => {
        const targetArray = Array.isArray(config.target) ? config.target : [config.target];
        executeStateActionsAsync((targetArray as IDeviceTargetWithValueFallback[]).map(d => ({
            deviceId: d.deviceId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: d.valueSerialized,
        })));
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);

    return (
        <ButtonBase sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleActionRequest} >
            <Stack direction="row" alignItems="stretch" justifyContent="center" sx={{ height: '100%' }}>
                <Stack justifyContent="center">
                    <Icon sx={{ fontSize: '2.4em !important' }}>{icon}</Icon>
                </Stack>
            </Stack>
        </ButtonBase>
    );
}
