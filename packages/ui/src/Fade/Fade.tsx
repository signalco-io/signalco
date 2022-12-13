import { ChildrenProps } from "../sharedTypes";

export interface FadeProps extends ChildrenProps {
    appear: boolean;
    duration?: number;
    collapsedWhenHidden?: boolean;
}

export default function Fade(props: FadeProps) {
    const { appear, collapsedWhenHidden, children } = props;
    const duration = props.duration ?? 200;

    return (
        <div style={{
            transition: `opacity ${duration}ms  ease-out`,
            opacity: appear ? 1 : 0,
            height: !appear && collapsedWhenHidden ? 0 : 'auto'
        }}>
            {children}
        </div>
    );
}
