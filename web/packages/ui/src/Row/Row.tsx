import { type CSSProperties } from "react";
import { type ChildrenProps } from "../sharedTypes";

export type RowProps = ChildrenProps & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: CSSProperties['justifyContent'];
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
}

export function Row({ children, spacing, alignItems, justifyContent, justifyItems, style }: RowProps) {
    return (
        <div
            className="flex gap-[var(--s-gap)] align-items-[var(--s-alignItems)] justify-content-[var(--s-justifyContent)] justify-items-[var(--s-justifyItems)]"
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
