import { cx } from "classix";
import type { HTMLAttributes, CSSProperties } from "react";

export type RowProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: CSSProperties['justifyContent'];
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
};

export function Row({ spacing, alignItems, justifyContent, justifyItems, style, className, ...props }: RowProps) {
    return (
        <div
            className={cx("flex [align-items:--s-alignItems] gap-[--s-gap] [justify-content:--s-justifyContent] [justify-items:--s-justifyItems]", className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                '--s-alignItems': alignItems ?? 'center',
                '--s-justifyContent': justifyContent ?? 'stretch',
                '--s-justifyItems': justifyItems,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
