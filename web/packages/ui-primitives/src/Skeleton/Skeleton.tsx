import { cx } from '../cx';

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cx('animate-pulse rounded-md bg-neutral-400 dark:bg-neutral-800', className)}
            {...props}
        />
    )
}
