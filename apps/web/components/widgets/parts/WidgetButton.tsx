import { IconButton } from '@mui/joy';
import Icon from 'components/shared/Icon';
import { StateAction, executeStateActionsAsync } from './WidgetState';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultTargetWithValue, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

const stateOptions: IWidgetConfigurationOption<any>[] = [
    { label: 'Icon', name: 'icon', type: 'string', optional: true },
    DefaultTargetWithValue,
    DefaultHeight(1),
    DefaultWidth(1)
];

export default function WidgetButton(props: WidgetSharedProps<any>) {
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

    return (
        <IconButton sx={{ height: '100%', width: '100%', display: 'block', textAlign: 'center' }} variant="plain" onClick={handleActionRequest} >
            <Icon sx={{ fontSize: '2.4em !important' }}>{icon}</Icon>
        </IconButton>
    );
}
