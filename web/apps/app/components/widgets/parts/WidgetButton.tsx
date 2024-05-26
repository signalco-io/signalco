import { Typography } from '@signalco/ui-primitives/Typography';
import { Button } from '@signalco/ui-primitives/Button';
import * as LucideIcons from '@signalco/ui-icons';
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

    const LucideIcon = Object.entries(LucideIcons).find(([key]) => key.toLowerCase() === icon.toLowerCase())?.[1];

    return (
        <Button
            variant="plain"
            onClick={handleActionRequest}
            className="m-0 size-full flex-row items-center justify-center p-0">
            {LucideIcon && <LucideIcon size={32} />}
            {(width > 1 && Boolean(label)) && <Typography>{label}</Typography>}
        </Button>
    );
}
