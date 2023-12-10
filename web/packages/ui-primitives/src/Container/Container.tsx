import type { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    centered?: boolean,
    padded?: boolean,
};

export function Container({ maxWidth, centered = true, padded = true, className, ...rest }: ContainerProps) {
    return (
        <div
            className={cx(
                'block w-full',
                (Boolean(maxWidth) && padded) && 'px-4',
                centered && 'mx-auto',
                maxWidth === 'xl' && 'max-w-[1536px]',
                (!maxWidth || maxWidth === 'lg') && 'max-w-[1280px]',
                maxWidth === 'md' && 'max-w-4xl',
                maxWidth === 'sm' && 'max-w-xl',
                maxWidth === 'xs' && 'max-w-md',
                className)}
            {...rest} />
    )
}
