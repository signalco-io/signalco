import { Icon } from '@signalco/ui-primitives/Icon';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';

export interface SmallIndicatorProps {
    isActive: boolean;
    icon: string;
    label: string;
    activeBackgroundColor: string;
    href: string;
    small?: boolean | undefined;
}

export function SmallIndicator({
    isActive, icon, label, activeBackgroundColor, href, small = true
}: SmallIndicatorProps) {
    return (
        <Button
            variant="plain"
            fullWidth
            href={href}
            startDecorator={(
                <Icon className={cx(
                    small && 'text-lg',
                    !small && 'text-2xl',
                    !isActive && 'opacity-30'
                )}>{icon}</Icon>
            )}
            className={cx(
                // 'rounded-md',
                !small && 'min-w-[52px] min-h-[82px]',
                small && 'min-w-[24px] min-h-[30px]'
            )}
            style={{
                backgroundColor: isActive ? activeBackgroundColor : undefined,
            }}>
            {label}
        </Button>
    );
}
