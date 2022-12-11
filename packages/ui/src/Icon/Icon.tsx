import { ChildrenProps } from '../sharedTypes';

export interface IconProps extends ChildrenProps {
    sx?: React.CSSProperties | undefined;
}

export default function Icon(props: IconProps) {
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
