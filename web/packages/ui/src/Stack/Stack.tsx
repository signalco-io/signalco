import { type CSSProperties } from "react";
import { type ChildrenProps } from "../sharedTypes";

export type StackProps = ChildrenProps & {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
    style?: CSSProperties | undefined;
}

export function Stack({ children, spacing, alignItems, justifyContent, style }: StackProps) {
    return (
        <div
            className="flex flex-col gap-[var(--s-gap)] align-items-[var(--s-alignItems)] justify-content-[var(--s-justifyContent)]"
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
