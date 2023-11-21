import type { CSSProperties, PropsWithChildren } from 'react';
import { cx } from 'classix';

export type ContainerProps = PropsWithChildren<{
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    centered?: boolean,
    padded?: boolean,
}>;

export function Container({ maxWidth, centered = true, padded = true, children }: ContainerProps) {
    let width: number | undefined = 1200;
    switch (maxWidth) {
    case 'md':
        width = 900;
        break;
    case 'sm':
        width = 600;
        break;
    case 'xs':
        width = 444;
        break;
    case 'xl':
        width = 1536;
        break;
    case false:
        width = undefined;
        break;
    default:
        break;
    }

    return (
        <div className={cx(
            'block max-w-[--container-maxWidth] w-full',
            (Boolean(width) && padded) && 'px-4',
            centered && 'mx-auto')}
        style={{
            '--container-maxWidth': width ? `${width}px` : undefined
        } as CSSProperties}>
            {children}
        </div>
    )
}
