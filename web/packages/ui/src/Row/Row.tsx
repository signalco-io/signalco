import type { PropsWithChildren, CSSProperties } from "react";

export type RowProps = PropsWithChildren<{
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: CSSProperties['justifyContent'];
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
}>;

export function Row({ children, spacing, alignItems, justifyContent, justifyItems, style }: RowProps) {
    return (
        <div
            className="flex [align-items:--s-alignItems] gap-[--s-gap] [justify-content:--s-justifyContent] [justify-items:--s-justifyItems]"
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
