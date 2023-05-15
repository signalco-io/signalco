import { cx } from "classix";
import type { CSSProperties, HTMLAttributes } from "react";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
};

export function Stack({ spacing, alignItems, justifyContent, style, className, ...props }: StackProps) {
    return (
        <div
            className={cx("flex flex-col gap-[var(--s-gap)] [align-items:--s-alignItems] [justify-content:--s-justifyContent]", className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                '--s-alignItems': alignItems ?? 'stretch',
                '--s-justifyContent': justifyContent,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
