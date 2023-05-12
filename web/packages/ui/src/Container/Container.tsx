import cx from 'classix';
import type { CSSProperties, PropsWithChildren } from 'react';

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

    const className = cx(
        "display-block [max-width:--container-maxWidth] width-full",
        (Boolean(width) && padded) && "padding-x-4",
        centered && "mx-auto");

    return (
        <div className={className}
            style={{
                "--container-maxWidth": width ? `${width}px` : undefined
            } as CSSProperties}>
            {children}
        </div>
    )
}
