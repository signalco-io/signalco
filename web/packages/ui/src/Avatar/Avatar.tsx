import { PropsWithChildren } from 'react';
import { cx } from 'classix';

export type AvatarProps = PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg'; // TODO: Implement
    src?: string; // TODO: Implement
    alt?: string; // TODO: Implement
    className?: string;
}>;

export function Avatar({ children, className }: AvatarProps) {
    return (<div className={cx(
        'flex h-10 min-w-[40px] max-w-[40px] items-center justify-center rounded-full bg-muted border border-border',
        className
    )}>{children}</div>);
}
