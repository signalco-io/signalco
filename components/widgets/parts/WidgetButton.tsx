import { Stack } from '@mui/system';
import { Button } from '@mui/joy';
import Icon from 'components/shared/Icon';
import { StateAction, executeStateActionsAsync } from './WidgetState';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultTargetWithValue, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';

const stateOptions: IWidgetConfigurationOption[] = [
    { label: 'Icon', name: 'icon', type: 'string', optional: true },
    DefaultTargetWithValue,
    DefaultHeight(1),
    DefaultWidth(1)
];

export default function WidgetButton(props: WidgetSharedProps) {
    const { config } = props;

    const icon = config?.icon ?? 'adjust';

    const handleActionRequest = () => {
        const targetArray = Array.isArray(config.target) ? config.target : [config.target];
        executeStateActionsAsync((targetArray as StateAction[]).map(d => ({
            entityId: d.entityId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: d.valueSerialized,
        })));
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);
    useWidgetActive(true, props);

    return (
        <Button sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'left' }} onClick={handleActionRequest} >
            <Stack direction="row" alignItems="stretch" justifyContent="center" sx={{ height: '100%' }}>
                <Stack justifyContent="center">
                    <Icon sx={{ fontSize: '2.4em !important' }}>{icon}</Icon>
                </Stack>
            </Stack>
        </Button>
    );
}
