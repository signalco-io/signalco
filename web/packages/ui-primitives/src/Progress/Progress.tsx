import { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
    value: number | undefined;
};

export function Progress({ value, className, ...rest }: ProgressProps) {
    return (
        <div
            className={cx(
                'relative h-4 w-full overflow-hidden rounded-full border',
                className
            )}
            {...rest}
        >
            <div
                className="size-full flex-1 bg-primary transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </div>
    );
}
