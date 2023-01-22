import { BatteryEmpty, BatteryLow, BatteryMedium, BatteryFull } from '@signalco/ui-icons';
import { Tooltip } from '@signalco/ui';

export default function BatteryIndicator({ level, size }: { level: number | undefined, size?: 'sm' }) {
    let Icon = BatteryEmpty;
    let color = 'var(--joy-palette-danger-400)';
    if (level && level < 15 && level > 0) {
        Icon = BatteryLow;
    }
    else if (level && level < 30) {
        Icon = BatteryLow;
        color = 'var(--joy-palette-warning-400)'
    }
    else if (level && level < 80) {
        Icon = BatteryMedium;
        color = 'var(--joy-palette-success-400)'
    }
    else if (level && level > 80) {
        Icon = BatteryFull;
        color = 'var(--joy-palette-success-400)'
    }

    return (
        <Tooltip title={`${level}%`}>
            <Icon stroke={color} size={size === 'sm' ? 16 : 24} />
        </Tooltip>
    );
}
