import type { HTMLAttributes } from 'react';
import { cx } from '@signalco/ui/cx';

export type IconProps = HTMLAttributes<HTMLSpanElement>;

export function Icon({ className, ...rest }: IconProps) {
    return (
        <span className={cx('material-icons', className)} {...rest} />
    );
}
