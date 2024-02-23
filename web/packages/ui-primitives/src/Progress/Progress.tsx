import { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
    value: number | undefined;
    trackClassName?: string;
};

export function Progress({ value, className, trackClassName, ...rest }: ProgressProps) {
    return (
        <div
            className={cx(
                'relative h-4 w-full overflow-hidden rounded-full border',
                className
            )}
            {...rest}
        >
            <div
                className={cx(
                    'size-full flex-1 bg-primary transition-all',
                    trackClassName
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </div>
    );
}
