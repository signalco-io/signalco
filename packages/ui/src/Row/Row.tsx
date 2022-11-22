import { ChildrenProps } from "../sharedTypes";

export interface RowProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'space-between' | 'end' | undefined;
}

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
