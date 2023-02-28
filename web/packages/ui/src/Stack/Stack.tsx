import { type CSSProperties } from "react";
import { type ChildrenProps } from "../sharedTypes";
import styles from './Stack.module.scss';

/** @alpha */
export interface StackProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
    style?: CSSProperties | undefined;
}

/** @alpha */
export default function Stack({ children, spacing, alignItems, justifyContent, style }: StackProps) {
    return (
        <div
            className={styles.root}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                '--s-alignItems': alignItems ?? 'stretch',
                '--s-justifyContent': justifyContent,
                ...style
            } as CSSProperties}
        >
            {children}
        </div>
    )
}
