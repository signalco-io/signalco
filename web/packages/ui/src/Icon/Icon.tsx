import type { CSSProperties } from 'react';
import type { ChildrenProps } from '../sharedTypes';

export type IconProps = ChildrenProps & {
    sx?: CSSProperties | undefined;
}

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
