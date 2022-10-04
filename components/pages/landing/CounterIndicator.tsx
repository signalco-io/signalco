import { useInView } from 'react-cool-inview';
import { Box, Typography } from '@mui/material';
import GentleSlide from 'components/shared/animations/GentleSlide';

function CounterIndicator(props: { count: number, hideAfter?: boolean }) {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <GentleSlide appear={inView} direction="down">
            <Box ref={observe} sx={{
                margin: 'auto',
                display: 'flex',
                width: '42px',
                height: props.hideAfter ? '106px' : '170px',
                alignItems: props.hideAfter ? 'end' : 'center'
            }}>
                <Box sx={{
                    pt: 0.5,
                    width: '42px',
                    height: '42px',
                    borderRadius: '21px',
                    color: 'background.default',
                    backgroundColor: 'text.primary',
                    position: 'relative',
                    userSelect: 'none',
                    '&::before': {
                        content: '""',
                        display: 'block',
                        height: '64px',
                        width: '1px',
                        background: 'linear-gradient(180deg, var(--mui-palette-text-primary) 40%, rgba(255, 255, 255, 0) 100%)',
                        position: 'absolute',
                        left: '20px',
                        top: '-64px',
                        transform: 'rotate(-180deg)'
                    },
                    '&::after': !props.hideAfter ? {
                        content: '""',
                        display: 'block',
                        height: '64px',
                        width: '1px',
                        background: 'linear-gradient(180deg, var(--mui-palette-text-primary) 40%, rgba(255, 255, 255, 0) 100%)',
                        position: 'absolute',
                        left: '21px',
                        top: '42px',
                    } : undefined
                }}>
                    <Typography textAlign="center" fontSize={23} fontWeight={600}>{props.count}</Typography>
                </Box>
            </Box>
        </GentleSlide>
    );
}

export default CounterIndicator;
