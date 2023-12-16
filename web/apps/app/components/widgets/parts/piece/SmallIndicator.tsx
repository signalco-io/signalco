import { ReactNode } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';

export interface SmallIndicatorProps {
    isActive: boolean;
    icon: ReactNode;
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
                <div className={cx(
                    small && 'text-lg',
                    !small && 'text-2xl'
                )}>{icon}</div>
            )}
            className={cx(
                'px-2',
                !small && 'min-w-[52px] min-h-[82px]',
                small && 'min-w-[24px] min-h-[30px]',
                !isActive && 'text-foreground/50'
            )}
            style={{
                backgroundColor: isActive ? activeBackgroundColor : undefined,
            }}>
            {label}
        </Button>
    );
}
