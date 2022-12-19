import { CSSProperties } from "react";
import { ChildrenProps } from "../sharedTypes";

/** @alpha */
export interface StackProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'center' | 'end' | undefined;
    style?: CSSProperties | undefined;
}

/** @alpha */
export default function Stack({ children, spacing, alignItems, justifyContent, style }: StackProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems,
                justifyContent,
                gap: `${(spacing ?? 0) * 8}px`,
                ...style
            }}
        >
            {children}
        </div>
    )
}
