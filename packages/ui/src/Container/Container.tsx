import cx from 'classix';
import { type CSSProperties } from 'react';
import { ChildrenProps } from '../sharedTypes';
import styles from './Container.module.scss';

/** @alpha */
export interface ContainerProps extends ChildrenProps {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

/** @alpha */
export default function Container({ maxWidth, children }: ContainerProps) {
    let width: number | undefined = 1200;
    switch (maxWidth) {
        case 'md':
            width = 900;
            break;
        case 'sm':
            width = 600;
        case 'xs':
            width = 444;
        case 'xl':
            width = 1536;
        case false:
            width = undefined;
        default:
            break;
    }

    return (
        <div className={cx(styles.root, !!width && styles.pad)} style={{
            "--container-maxWidth": width ? `${width}px` : undefined
        } as CSSProperties}>
            {children}
        </div>
    )
}
