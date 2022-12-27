import { ChildrenProps } from "../sharedTypes";
import styles from './Row.module.scss';

/** @alpha */
export interface RowProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | undefined;
    justifyContent?: 'start' | 'center' | 'space-between' | 'end' | undefined;
}

/** @alpha */
export default function Row({ children, spacing, alignItems, justifyContent }: RowProps) {
    return (
        <div
            className={styles.root}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                '--s-alignItems': alignItems ?? 'center',
                '--s-justifyContent': justifyContent
            }}
        >
            {children}
        </div>
    )
}
