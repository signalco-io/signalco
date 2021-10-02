import React from 'react';
import { Box } from '@mui/material';
import classes from './RippleIndicator.module.scss';

export interface IRippleIndicatorProps {
    size?: number,
    interval?: number
}

export interface IRippleIndicatorRef {
    trigger: () => void
}

const RippleIndicator = (props: IRippleIndicatorProps) => {
    const { size = 42 } = props;

    return (
        <Box position="relative" sx={{ width: `${size}px`, height: `${size}px` }}>
            <Box className={classes.rim} />
        </Box>
    );
}

export default RippleIndicator;