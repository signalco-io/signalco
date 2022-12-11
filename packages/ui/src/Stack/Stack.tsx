import { ChildrenProps } from "../sharedTypes";

/** @alpha */
export interface StackProps extends ChildrenProps {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
}

/** @alpha */
export default function Stack({ children, spacing, alignItems }: StackProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems,
                gap: `${(spacing ?? 0) * 8}px`
            }}
        >
            {children}
        </div>
    )
}
