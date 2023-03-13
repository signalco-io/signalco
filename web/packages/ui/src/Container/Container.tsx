import cx from 'classix';
import { type CSSProperties } from 'react';
import { ChildrenProps } from '../sharedTypes';
import styles from './Container.module.scss';

/** @alpha */
export interface ContainerProps extends ChildrenProps {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    centered?: boolean,
    padded?: boolean,
}

/** @alpha */
export default function Container({ maxWidth, centered = true, padded = true, children }: ContainerProps) {
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
            styles.root,
            (Boolean(width) && padded) && styles.pad,
            centered && styles.centered)}
            style={{
                "--container-maxWidth": width ? `${width}px` : undefined
            } as CSSProperties}>
            {children}
        </div>
    )
}
