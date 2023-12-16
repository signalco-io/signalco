import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { cx } from '@signalco/ui-primitives/cx';
import { BatteryEmpty, BatteryLow, BatteryMedium, BatteryFull } from '@signalco/ui-icons';

type BatteryIndicatorProps = {
    level: number | undefined;
    size?: 'sm';
    minLevel?: 'empty' | 'low' | 'medium' | 'full';
};

export default function BatteryIndicator({ level, size, minLevel = 'full' }: BatteryIndicatorProps) {
    let show = true;
    let Icon = BatteryEmpty;
    let color = 'red';
    if (level && level < 15 && level > 0) {
        Icon = BatteryLow;
    }
    else if (level && level < 30) {
        Icon = BatteryLow;
        color = 'yellow'
        show = minLevel === 'low' || minLevel === 'medium' || minLevel === 'full';
    }
    else if (level && level < 80) {
        Icon = BatteryMedium;
        color = 'green'
        show = minLevel === 'medium' || minLevel === 'full';
    }
    else if (level && level > 80) {
        Icon = BatteryFull;
        color = 'green'
        show = minLevel === 'full';
    }

    if (!show) {
        return null;
    }

    return (
        <Tooltip title={`${level}%`}>
            <Icon className={cx(
                color === 'green' && 'stroke-green-500',
                color === 'yellow' && 'stroke-yellow-500',
                color === 'red' && 'stroke-red-500'
            )}
            size={size === 'sm' ? 16 : 20} />
        </Tooltip>
    );
}
