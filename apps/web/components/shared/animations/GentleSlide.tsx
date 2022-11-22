import { Box } from '@signalco/ui';
import { ChildrenProps } from 'src/sharedTypes';

export interface GentleSlideProps extends ChildrenProps {
    appear: boolean,
    index?: number,
    appearDelayPerIndex?: number | undefined,
    amount?: number,
    duration?: number,
    direction?: 'left' | 'down',
    collapsedWhenHidden?: boolean
}

export default function GentleSlide(props: GentleSlideProps) {
    const { children, appear, index, collapsedWhenHidden } = props;
    const appearDelayPerIndex = props.appearDelayPerIndex ?? 200;
    const amount = props.amount ?? 12;
    const duration = props.duration ?? 1000;
    const direction = props.direction ?? 'left';

    const translate = direction === 'left' ? `translateX(${amount}px)` : `translateY(-${amount}px)`;

    return (
        <Box sx={{
            transition: `opacity ${duration}ms  ease-out, transform ${duration}ms ease-out`,
            transitionDelay: `${appearDelayPerIndex * (index ?? 0)}ms`,
            opacity: appear ? 1 : 0,
            transform: appear ? 'none' : translate,
            height: !appear && collapsedWhenHidden ? 0 : 'auto',
            width: '100%'
        }}>
            {children}
        </Box>
    )
}
