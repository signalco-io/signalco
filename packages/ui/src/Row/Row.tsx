import { type CSSProperties } from "react";
import { type ChildrenProps } from "../sharedTypes";
import styles from './Row.module.scss';

/** @alpha */
export interface RowProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: 'start' | 'center' | 'space-between' | 'end' | 'stretch' | undefined;
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
}

/** @alpha */
export default function Row({ children, spacing, alignItems, justifyContent, justifyItems, style }: RowProps) {
    return (
        <div
            className={styles.root}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                '--s-alignItems': alignItems ?? 'center',
                '--s-justifyContent': justifyContent ?? 'stretch',
                '--s-justifyItems': justifyItems,
                ...style
            } as CSSProperties}
        >
            {children}
        </div>
    )
}
