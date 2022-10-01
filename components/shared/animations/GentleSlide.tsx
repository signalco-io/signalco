import { Box } from '@mui/system';
import { ChildrenProps } from 'src/sharedTypes';

export interface GentleSlideProps extends ChildrenProps {
    appear: boolean,
    index?: number,
    appearDelayPerIndex?: number | undefined,
    amount?: number,
    direction?: 'left' | 'down'
}

export default function GentleSlide(props: GentleSlideProps) {
    const { children, appear, index } = props;
    const appearDelayPerIndex = props.appearDelayPerIndex ?? 200;
    const amount = props.amount ?? 12;
    const direction = props.direction ?? 'left';

    const translate = direction === 'left' ? `translateX(${amount}px)` : `translateY(-${amount}px)`;

    return (
        <Box sx={{
            transition: 'opacity 1s  ease-out, transform 1s ease-out',
            transitionDelay: `${appearDelayPerIndex * (index ?? 0)}ms`,
            opacity: appear ? 1 : 0,
            transform: appear ? 'none' : translate
        }}>
            {children}
        </Box>
    )
}
