import { BatteryEmpty, BatteryLow, BatteryMedium, BatteryFull } from '@signalco/ui-icons';
import { Tooltip } from '@signalco/ui';

type BatteryIndicatorProps = {
    level: number | undefined;
    size?: 'sm';
    minLevel?: 'empty' | 'low' | 'medium' | 'full';
};

export default function BatteryIndicator({ level, size, minLevel = 'full' }: BatteryIndicatorProps) {
    let show = true;
    let Icon = BatteryEmpty;
    let color = 'var(--joy-palette-danger-400)';
    if (level && level < 15 && level > 0) {
        Icon = BatteryLow;
    }
    else if (level && level < 30) {
        Icon = BatteryLow;
        color = 'var(--joy-palette-warning-400)'
        show = minLevel === 'low' || minLevel === 'medium' || minLevel === 'full';
    }
    else if (level && level < 80) {
        Icon = BatteryMedium;
        color = 'var(--joy-palette-success-400)'
        show = minLevel === 'medium' || minLevel === 'full';
    }
    else if (level && level > 80) {
        Icon = BatteryFull;
        color = 'var(--joy-palette-success-400)'
        show = minLevel === 'full';
    }

    if (!show) {
        return null;
    }

    return (
        <Tooltip title={`${level}%`}>
            <Icon stroke={color} size={size === 'sm' ? 16 : 20} />
        </Tooltip>
    );
}
