import { IconButton } from '@mui/joy';
import IContact from 'src/contacts/IContact';
import Icon from 'components/shared/Icon';
import { StateAction, executeStateActionsAsync } from './WidgetState';
import { WidgetSharedProps } from '../Widget';
import { DefaultHeight, DefaultTargetWithValueMultiple, DefaultWidth } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';

type ConfigProps = {
    icon: string | undefined;
    label: string | undefined;
    target: IContact[];
    polygonApiKey: string;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    { label: 'Icon', name: 'icon', type: 'string', optional: true },
    { label: 'Label', name: 'label', type: 'string', optional: true },
    DefaultTargetWithValueMultiple,
    DefaultHeight(1),
    DefaultWidth(1)
];

export default function WidgetButton(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;

    const icon = config?.icon ?? 'adjust';

    const handleActionRequest = () => {
        executeStateActionsAsync((config?.target as StateAction[]).map(d => ({
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
