import { CSSProperties, ReactElement } from 'react';
import type { ColorVariants } from '../theme';
import { cx } from '../cx';

export type DotIndicatorProps = {
    color: ColorVariants;
    /**
     * @default filled
     */
    variant?: 'outlined' | 'filled';
    content?: ReactElement;
    /**
     * @default 10
     */
    size?: number;
}

export function DotIndicator({ color, content, size: requestedSize, variant = 'filled' }: DotIndicatorProps) {
    const size = requestedSize || 10;
    return (
        <div
            className={cx(
                'flex flex-col items-center justify-center text-white text-center rounded-full w-[--dot-size] h-[--dot-size]',
                variant === 'filled' && color === 'success' && 'bg-green-500',
                variant === 'filled' && color === 'warning' && 'bg-yellow-500',
                variant === 'filled' && color === 'danger' && 'bg-red-500',
                variant === 'filled' && color === 'info' && 'bg-blue-500',
                variant === 'filled' && color === 'neutral' && 'bg-slate-500',
                variant === 'outlined' && color === 'success' && 'border border-green-500',
                variant === 'outlined' && color === 'warning' && 'border border-yellow-500',
                variant === 'outlined' && color === 'danger' && 'border border-red-500',
                variant === 'outlined' && color === 'info' && 'border border-blue-500',
                variant === 'outlined' && color === 'neutral' && 'border border-slate-500',
            )}
            style={{
                '--dot-size': `${size}px`
            } as CSSProperties}>
            {content}
        </div>
    )
}
