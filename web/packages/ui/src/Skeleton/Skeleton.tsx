import { cx } from 'classix';

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cx('uitw-animate-pulse uitw-rounded-md uitw-bg-muted', className)}
            {...props}
        />
    )
}
