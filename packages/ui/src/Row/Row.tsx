import { ChildrenProps } from "../sharedTypes";

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
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: alignItems ?? 'center',
                justifyContent,
                gap: `${(spacing ?? 0) * 8}px`
            }}
        >
            {children}
        </div>
    )
}
