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
        'uitw-flex uitw-h-10 uitw-min-w-[40px] uitw-max-w-[40px] uitw-items-center uitw-justify-center uitw-rounded-full uitw-bg-muted uitw-border',
        className
    )}>{children}</div>);
}
