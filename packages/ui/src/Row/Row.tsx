import { ChildrenProps } from "../sharedTypes";

export interface RowProps extends ChildrenProps {
    spacing?: number;
    justifyContent?: 'start' | 'center' | 'space-between' | 'end' | undefined;
}

export default function Row({ children, spacing, justifyContent }: RowProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent,
                gap: `${(spacing ?? 0) * 4}px`
            }}
        >
            {children}
        </div>
    )
}
