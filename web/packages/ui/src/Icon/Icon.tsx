import type { CSSProperties, PropsWithChildren } from 'react';

export type IconProps = PropsWithChildren<{
    sx?: CSSProperties | undefined;
}>;

export function Icon(props: IconProps) {
    return (
        <span
            className="material-icons"
            style={{
                ...props.sx
            }}>
            {props.children}
        </span>
    );
}
