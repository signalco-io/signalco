import { PropsWithChildren, type CSSProperties } from "react";

export type StackProps = PropsWithChildren<{
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
    style?: CSSProperties | undefined;
}>;

export function Stack({ children, spacing, alignItems, justifyContent, style }: StackProps) {
    return (
        <div
            className="flex flex-col gap-[var(--s-gap)] [align-items:--s-alignItems] [justify-content:--s-justifyContent]"
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
