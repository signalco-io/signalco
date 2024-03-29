import type { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * The maximum width of the container.
     * @default 'lg'
     */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    /**
     * Whether to center the container.
     * @default true
     */
    centered?: boolean,
    /**
     * Whether to add padding to the container.
     * @default true
     */
    padded?: boolean,
};

export function Container({ maxWidth, centered = true, padded = true, className, ...rest }: ContainerProps) {
    return (
        <div className={cx(
            'block w-full',
            padded && 'px-4',
            centered && 'mx-auto',
            maxWidth === 'xl' && 'max-w-[1536px]',
            (!maxWidth || maxWidth === 'lg') && 'max-w-[1280px]',
            maxWidth === 'md' && 'max-w-4xl',
            maxWidth === 'sm' && 'max-w-xl',
            maxWidth === 'xs' && 'max-w-md',
            className)}
            {...rest}
        />
    )
}
