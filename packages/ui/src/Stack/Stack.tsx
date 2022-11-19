import { ChildrenProps } from "../sharedTypes";

export interface StackProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
}

export default function Stack({ children, spacing, alignItems }: StackProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems,
                gap: `${(spacing ?? 0) * 4}px`
            }}
        >
            {children}
        </div>
    )
}
