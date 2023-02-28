import { Avatar, Button, Icon, Row, Typography } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultTargetWithValueMultiple, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useAudioOn from '../../../src/hooks/sounds/useAudioOn';
import IContact from '../../../src/contacts/IContact';
import { StateAction, executeStateActionsAsync } from './WidgetState';

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
    DefaultRows(1),
    DefaultColumns(1)
];

export default function WidgetButton(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    const audioClick = useAudioOn();

    const width = config?.columns ?? 1;
    const label = config?.label;
    const icon = config?.icon ?? 'adjust';

    const handleActionRequest = () => {
        audioClick.play();
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
        <Button sx={{ height: '100%', width: 'calc(100% - 2px)', justifyContent: 'start' }} variant="plain" onClick={handleActionRequest} >
            <Row spacing={1}>
                <Avatar size="lg">
                    <Icon sx={{ fontSize: '2em !important' }}>{icon}</Icon>
                </Avatar>
                {width > 1 && <Typography>{label}</Typography>}
            </Row>
        </Button>
    );
}
