import { Chip, ChipProps } from '@signalco/ui-primitives/Chip';
import { Check, Disabled } from '@signalco/ui-icons';

export type EnableChipProps = Omit<ChipProps, 'disabled'> & {
    readonly?: boolean;
    enabled: boolean;
}

export function EnableChip({ enabled, readonly, ...rest }: EnableChipProps) {
    return (
        <Chip
            disabled={readonly}
            startDecorator={!enabled ? <Disabled className="size-4" /> : <Check className="size-4" />}
            {...rest}>
            {!enabled ? 'Disabled' : 'Enabled'}
        </Chip>
    );
}
