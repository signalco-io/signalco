import type { PropsWithChildren } from 'react';

export type FadeProps = PropsWithChildren<{
    appear: boolean;
    duration?: number;
    collapsedWhenHidden?: boolean;
}>;

export function Fade(props: FadeProps) {
    const { appear, collapsedWhenHidden, children } = props;
    const duration = props.duration ?? 200;

    // TODO: Migrate to TW
    return (
        <div style={{
            transition: `opacity ${duration}ms ease-out`,
            opacity: appear ? 1 : 0,
            height: !appear && collapsedWhenHidden ? 0 : 'auto'
        }}>
            {children}
        </div>
    );
}
