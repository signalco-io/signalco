import { ChildrenProps } from "../sharedTypes";

export interface StackProps extends ChildrenProps {
    spacing?: number;
}

export default function Stack({ children, spacing }: StackProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${(spacing ?? 0) * 4}px`
            }}
        >
            {children}
        </div>
    )
}
